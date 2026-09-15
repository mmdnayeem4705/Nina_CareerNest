from django.db.models import Count, Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from companies.models import Company
from users.permissions import IsRecruiter

from .models import Bookmark, Job
from .serializers import JobSerializer, JobWriteSerializer


class JobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = (
            Job.objects.select_related("company", "posted_by")
            .annotate(applicant_count=Count("applications"))
            .order_by("-created_at")
        )
        if self.request.user.is_authenticated and self.request.user.role == "recruiter":
            pass
        else:
            qs = qs.filter(is_active=True)
        q = self.request.query_params.get("q")
        location = self.request.query_params.get("location")
        job_type = self.request.query_params.get("job_type")
        skill = self.request.query_params.get("skill")
        if q:
            qs = qs.filter(
                Q(title__icontains=q)
                | Q(description__icontains=q)
                | Q(company__name__icontains=q)
                | Q(required_skills__icontains=q)
            )
        if location:
            qs = qs.filter(location__icontains=location)
        if job_type:
            qs = qs.filter(job_type=job_type)
        if skill:
            qs = qs.filter(required_skills__icontains=skill)
        return qs


class JobDetailView(generics.RetrieveAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Job.objects.select_related("company", "posted_by").annotate(applicant_count=Count("applications"))


class RecruiterJobListCreateView(APIView):
    permission_classes = [IsRecruiter]

    def get(self, request):
        company = Company.objects.filter(owner=request.user).order_by("id").first()
        if not company:
            company = Company.objects.create(owner=request.user, name="My Company")
        jobs = Job.objects.filter(company=company).annotate(applicant_count=Count("applications"))
        return Response(JobSerializer(jobs, many=True, context={"request": request}).data)

    def post(self, request):
        company = Company.objects.filter(owner=request.user).order_by("id").first()
        if not company:
            company = Company.objects.create(owner=request.user, name="My Company")
        serializer = JobWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        job = serializer.save(company=company, posted_by=request.user)
        return Response(JobSerializer(job, context={"request": request}).data, status=status.HTTP_201_CREATED)


class RecruiterJobDetailView(APIView):
    permission_classes = [IsRecruiter]

    def get_object(self, request, pk):
        return (
            Job.objects.filter(pk=pk, posted_by=request.user)
            .annotate(applicant_count=Count("applications"))
            .first()
        )

    def get(self, request, pk):
        job = self.get_object(request, pk)
        if not job:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(JobSerializer(job, context={"request": request}).data)

    def patch(self, request, pk):
        job = self.get_object(request, pk)
        if not job:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = JobWriteSerializer(job, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(JobSerializer(job, context={"request": request}).data)

    def delete(self, request, pk):
        job = self.get_object(request, pk)
        if not job:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BookmarkToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        bookmark, created = Bookmark.objects.get_or_create(user=request.user, job=job)
        if not created:
            bookmark.delete()
            return Response({"saved": False})
        return Response({"saved": True})


class SavedJobsView(generics.ListAPIView):
    serializer_class = JobSerializer
    pagination_class = None

    def get_queryset(self):
        return Job.objects.filter(bookmarks__user=self.request.user).select_related("company")
