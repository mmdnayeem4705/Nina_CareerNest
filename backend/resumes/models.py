from django.conf import settings
from django.db import models


class Resume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="resumes")
    file = models.FileField(upload_to="resumes/")
    original_name = models.CharField(max_length=255, blank=True)
    extracted_text = models.TextField(blank=True)
    extracted_skills = models.JSONField(default=list, blank=True)
    is_primary = models.BooleanField(default=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]
