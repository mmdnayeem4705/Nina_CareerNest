from rest_framework import serializers

from jobs.serializers import JobSerializer
from users.serializers import UserSerializer
from .models import Application, Interview


class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = ("id", "scheduled_at", "meeting_link", "location", "notes", "created_at")


class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    candidate = UserSerializer(read_only=True)
    interviews = InterviewSerializer(many=True, read_only=True)
    candidate_skills = serializers.SerializerMethodField()
    candidate_years = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = (
            "id",
            "job",
            "candidate",
            "cover_letter",
            "status",
            "match_score",
            "matched_skills",
            "missing_skills",
            "candidate_skills",
            "candidate_years",
            "interviews",
            "created_at",
            "updated_at",
        )

    def get_candidate_skills(self, obj):
        profile = getattr(obj.candidate, "candidate_profile", None)
        return profile.skills if profile else []

    def get_candidate_years(self, obj):
        profile = getattr(obj.candidate, "candidate_profile", None)
        return profile.years_experience if profile else 0
