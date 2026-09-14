from rest_framework import serializers

from companies.serializers import CompanySerializer
from .models import Bookmark, Job


class JobSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    applicant_count = serializers.IntegerField(read_only=True, required=False)
    is_saved = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = (
            "id",
            "company",
            "posted_by",
            "title",
            "description",
            "requirements",
            "required_skills",
            "location",
            "job_type",
            "salary_min",
            "salary_max",
            "is_active",
            "created_at",
            "updated_at",
            "applicant_count",
            "is_saved",
            "has_applied",
        )
        read_only_fields = ("id", "posted_by", "created_at", "updated_at")

    def get_is_saved(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return Bookmark.objects.filter(user=request.user, job=obj).exists()

    def get_has_applied(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.applications.filter(candidate=request.user).exists()


class JobWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = (
            "title",
            "description",
            "requirements",
            "required_skills",
            "location",
            "job_type",
            "salary_min",
            "salary_max",
            "is_active",
        )
