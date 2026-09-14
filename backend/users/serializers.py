from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CandidateProfile, Education, Experience, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "is_blocked",
            "avatar",
            "date_joined",
        )
        read_only_fields = ("id", "role", "is_blocked", "date_joined")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "email", "password", "first_name", "last_name", "phone", "role")

    def validate_role(self, value):
        if value not in (User.Role.CANDIDATE, User.Role.RECRUITER):
            raise serializers.ValidationError("Role must be candidate or recruiter.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        role = validated_data.get("role", User.Role.CANDIDATE)
        user = User(**validated_data)
        user.role = role
        if role == User.Role.ADMIN:
            user.role = User.Role.CANDIDATE
        user.set_password(password)
        user.save()
        if user.role == User.Role.CANDIDATE:
            CandidateProfile.objects.create(user=user)
        return user


class EducationSerializer(serializers.ModelSerializer):
    def to_internal_value(self, data):
        data = dict(data)
        for key in ("start_year", "end_year"):
            if data.get(key) in ("", None):
                data[key] = None
        return super().to_internal_value(data)

    class Meta:
        model = Education
        fields = ("id", "school", "degree", "field", "start_year", "end_year")


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ("id", "company", "title", "start_date", "end_date", "description")


class CandidateProfileSerializer(serializers.ModelSerializer):
    education = EducationSerializer(many=True, required=False)
    experience = ExperienceSerializer(many=True, required=False)
    user = UserSerializer(read_only=True)

    class Meta:
        model = CandidateProfile
        fields = (
            "id",
            "user",
            "headline",
            "bio",
            "location",
            "skills",
            "years_experience",
            "website",
            "linkedin",
            "education",
            "experience",
        )

    def update(self, instance, validated_data):
        education_data = validated_data.pop("education", None)
        experience_data = validated_data.pop("experience", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if education_data is not None:
            instance.education.all().delete()
            for item in education_data:
                Education.objects.create(profile=instance, **item)
        if experience_data is not None:
            instance.experience.all().delete()
            for item in experience_data:
                Experience.objects.create(profile=instance, **item)
        return instance


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["email"] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.is_blocked:
            raise serializers.ValidationError("This account has been blocked.")
        data["user"] = UserSerializer(self.user).data
        return data
