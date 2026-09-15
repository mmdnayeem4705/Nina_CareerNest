from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from jobs.models import Job
from notifications.models import Notification
from resumes.matching import score_candidate
from users.models import CandidateProfile
from users.permissions import IsCandidate, IsRecruiter, IsStaffRole

from .models import Application, Interview
from .serializers import ApplicationSerializer, InterviewSerializer


def notify(user, title, body, link=""):
    Notification.objects.create(user=user, title=title, body=body, link=link)


class ApplyView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request, pk):
        try:
            job = Job.objects.select_related("posted_by").get(pk=pk, is_active=True)
        except Job.DoesNotExist:
            return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)
        if Application.objects.filter(job=job, candidate=request.user).exists():
            return Response({"detail": "You already applied."}, status=status.HTTP_400_BAD_REQUEST)
        profile, _ = CandidateProfile.objects.get_or_create(user=request.user)
        result = score_candidate(job.required_skills or [], profile.skills or [])
        application = Application.objects.create(
            job=job,
            candidate=request.user,
            cover_letter=request.data.get("cover_letter", ""),
            match_score=result["score"],
            matched_skills=result["matched"],
            missing_skills=result["missing"],
        )
        notify(
            job.posted_by,
            "New application",
            f"{request.user.first_name or request.user.email} applied for {job.title} ({result['score']}% match).",
            f"/recruiter/jobs/{job.id}",
        )
        notify(
            request.user,
            "Application submitted",
            f"You applied for {job.title} at {job.company.name}.",
            "/applications",
        )
        return Response(ApplicationSerializer(application, context={"request": request}).data, status=status.HTTP_201_CREATED)


class MyApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsCandidate]
    pagination_class = None

    def get_queryset(self):
        return (
            Application.objects.filter(candidate=self.request.user)
            .select_related("job", "job__company", "candidate")
            .prefetch_related("interviews")
        )


class RecruiterApplicantsView(APIView):
    permission_classes = [IsStaffRole]

    def get(self, request, pk):
        job_filters = {"pk": pk}
        if request.user.role == "recruiter":
            job_filters["posted_by"] = request.user
        try:
            job = Job.objects.get(**job_filters)
        except Job.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        qs = Application.objects.filter(job=job).select_related("candidate", "job", "job__company").prefetch_related("interviews")
        skill = request.query_params.get("skill")
        min_exp = request.query_params.get("min_score")
        min_years = request.query_params.get("min_years")
        q = request.query_params.get("q")
        if skill:
            qs = qs.filter(Q(matched_skills__icontains=skill) | Q(candidate__candidate_profile__skills__icontains=skill))
        if min_exp:
            qs = qs.filter(match_score__gte=float(min_exp))
        if min_years:
            qs = qs.filter(candidate__candidate_profile__years_experience__gte=int(min_years))
        if q:
            qs = qs.filter(
                Q(candidate__first_name__icontains=q)
                | Q(candidate__last_name__icontains=q)
                | Q(candidate__email__icontains=q)
            )
        return Response(ApplicationSerializer(qs, many=True, context={"request": request}).data)


class ApplicationStatusView(APIView):
    permission_classes = [IsStaffRole]

    def patch(self, request, pk):
        try:
            application = Application.objects.select_related("job", "candidate").get(pk=pk)
        except Application.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        if request.user.role == "recruiter" and application.job.posted_by_id != request.user.id:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        new_status = request.data.get("status")
        if new_status not in Application.Status.values:
            return Response({"detail": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)
        application.status = new_status
        application.save(update_fields=["status", "updated_at"])
        notify(
            application.candidate,
            "Application update",
            f"Your application for {application.job.title} is now: {application.get_status_display()}.",
            "/applications",
        )
        return Response(ApplicationSerializer(application, context={"request": request}).data)


class ScheduleInterviewView(APIView):
    permission_classes = [IsRecruiter]

    def post(self, request, pk):
        try:
            application = Application.objects.select_related("job", "candidate").get(pk=pk, job__posted_by=request.user)
        except Application.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = InterviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        interview = serializer.save(application=application)
        application.status = Application.Status.INTERVIEW
        application.save(update_fields=["status", "updated_at"])
        notify(
            application.candidate,
            "Interview scheduled",
            f"An interview was scheduled for {application.job.title}.",
            "/applications",
        )
        return Response(InterviewSerializer(interview).data, status=status.HTTP_201_CREATED)
