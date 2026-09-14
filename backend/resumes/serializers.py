from rest_framework import serializers

from .models import Resume


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = (
            "id",
            "file",
            "original_name",
            "extracted_text",
            "extracted_skills",
            "is_primary",
            "uploaded_at",
        )
        read_only_fields = ("id", "original_name", "extracted_text", "extracted_skills", "uploaded_at")
