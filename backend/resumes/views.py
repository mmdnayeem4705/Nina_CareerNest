from django.http import FileResponse
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from applications.models import Application
from users.models import CandidateProfile
from users.permissions import IsCandidate, IsRecruiter

from .matching import extract_skills, extract_text, score_candidate
from .models import Resume
from .serializers import ResumeSerializer


class ResumeUploadView(APIView):
    permission_classes = [IsCandidate]

    def get(self, request):
        resumes = Resume.objects.filter(user=request.user)
        return Response(ResumeSerializer(resumes, many=True, context={"request": request}).data)

    def post(self, request):
        upload = request.FILES.get("file")
        if not upload:
            return Response({"detail": "file is required"}, status=status.HTTP_400_BAD_REQUEST)
        Resume.objects.filter(user=request.user, is_primary=True).update(is_primary=False)
        resume = Resume.objects.create(user=request.user, file=upload, original_name=upload.name, is_primary=True)
        try:
            text = extract_text(resume.file.path)
        except Exception:
            text = ""
        skills = extract_skills(text)
        resume.extracted_text = text[:20000]
        resume.extracted_skills = skills
        resume.save()
        profile, _ = CandidateProfile.objects.get_or_create(user=request.user)
        merged = list(dict.fromkeys([*(profile.skills or []), *skills]))
        profile.skills = merged
        profile.save(update_fields=["skills"])
        return Response(ResumeSerializer(resume, context={"request": request}).data, status=status.HTTP_201_CREATED)


class MatchPreviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        from jobs.models import Job

        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        profile = getattr(request.user, "candidate_profile", None)
        skills = profile.skills if profile else []
        return Response(score_candidate(job.required_skills or [], skills))


class RecruiterResumeDownloadView(APIView):
    permission_classes = [IsRecruiter]

    def get(self, request, pk):
        try:
            application = Application.objects.select_related("candidate").get(pk=pk, job__posted_by=request.user)
        except Application.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        resume = Resume.objects.filter(user=application.candidate, is_primary=True).first()
        if not resume:
            resume = Resume.objects.filter(user=application.candidate).first()
        if not resume:
            return Response({"detail": "No resume uploaded."}, status=status.HTTP_404_NOT_FOUND)
        return FileResponse(resume.file.open("rb"), as_attachment=True, filename=resume.original_name or "resume")
