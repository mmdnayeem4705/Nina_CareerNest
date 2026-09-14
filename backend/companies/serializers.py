from rest_framework import serializers

from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source="owner.email", read_only=True)

    class Meta:
        model = Company
        fields = (
            "id",
            "name",
            "description",
            "website",
            "industry",
            "location",
            "logo",
            "owner",
            "owner_email",
            "created_at",
        )
        read_only_fields = ("id", "owner", "created_at")
