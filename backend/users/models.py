from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        CANDIDATE = "candidate", "Candidate"
        RECRUITER = "recruiter", "Recruiter"
        ADMIN = "admin", "Admin"

    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CANDIDATE)
    phone = models.CharField(max_length=30, blank=True)
    is_blocked = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.email} ({self.role})"


class CandidateProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="candidate_profile")
    headline = models.CharField(max_length=180, blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=120, blank=True)
    skills = models.JSONField(default=list, blank=True)
    years_experience = models.PositiveIntegerField(default=0)
    website = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)

    def __str__(self):
        return self.user.email


class Education(models.Model):
    profile = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name="education")
    school = models.CharField(max_length=200)
    degree = models.CharField(max_length=120, blank=True)
    field = models.CharField(max_length=120, blank=True)
    start_year = models.PositiveIntegerField(null=True, blank=True)
    end_year = models.PositiveIntegerField(null=True, blank=True)


class Experience(models.Model):
    profile = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name="experience")
    company = models.CharField(max_length=200)
    title = models.CharField(max_length=160)
    start_date = models.CharField(max_length=40, blank=True)
    end_date = models.CharField(max_length=40, blank=True)
    description = models.TextField(blank=True)
