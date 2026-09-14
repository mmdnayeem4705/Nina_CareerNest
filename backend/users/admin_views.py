from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from applications.models import Application
from companies.models import Company
from companies.serializers import CompanySerializer
from jobs.models import Job
from jobs.serializers import JobSerializer
from users.models import User
from users.permissions import IsAdminRole
from users.serializers import UserSerializer


class AdminStatsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return Response(
            {
                "users": User.objects.count(),
                "candidates": User.objects.filter(role=User.Role.CANDIDATE).count(),
                "recruiters": User.objects.filter(role=User.Role.RECRUITER).count(),
                "blocked_users": User.objects.filter(is_blocked=True).count(),
                "companies": Company.objects.count(),
                "jobs": Job.objects.count(),
                "open_jobs": Job.objects.filter(is_active=True).count(),
                "applications": Application.objects.count(),
                "applications_this_month": Application.objects.filter(created_at__gte=month_start).count(),
                "status_breakdown": list(
                    Application.objects.values("status").annotate(count=Count("id")).order_by("status")
                ),
                "top_skills": self._top_skills(),
            }
        )

    def _top_skills(self):
        counts = {}
        for skills in Job.objects.values_list("required_skills", flat=True):
            for skill in skills or []:
                key = str(skill).strip()
                if key:
                    counts[key] = counts.get(key, 0) + 1
        return sorted(
            [{"skill": k, "count": v} for k, v in counts.items()],
            key=lambda x: x["count"],
            reverse=True,
        )[:8]


class AdminUserListView(generics.ListAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = UserSerializer
    pagination_class = None

    def get_queryset(self):
        qs = User.objects.all().order_by("-date_joined")
        role = self.request.query_params.get("role")
        q = self.request.query_params.get("q")
        if role:
            qs = qs.filter(role=role)
        if q:
            qs = qs.filter(Q(email__icontains=q) | Q(first_name__icontains=q) | Q(last_name__icontains=q))
        return qs


class AdminUserBlockView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        if user.role == User.Role.ADMIN:
            return Response({"detail": "Cannot block an admin."}, status=status.HTTP_400_BAD_REQUEST)
        user.is_blocked = not user.is_blocked
        user.save(update_fields=["is_blocked"])
        return Response(UserSerializer(user).data)


class AdminCompanyListView(generics.ListAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = CompanySerializer
    queryset = Company.objects.all().order_by("-created_at")
    pagination_class = None


class AdminJobListView(generics.ListAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = JobSerializer
    queryset = Job.objects.select_related("company", "posted_by").all().order_by("-created_at")
    pagination_class = None


class AdminJobToggleView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        job.is_active = not job.is_active
        job.save(update_fields=["is_active"])
        return Response(JobSerializer(job).data)
