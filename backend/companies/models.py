from django.db import models
from django.conf import settings


class Company(models.Model):
    name = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    industry = models.CharField(max_length=120, blank=True)
    location = models.CharField(max_length=160, blank=True)
    logo = models.ImageField(upload_to="company_logos/", blank=True, null=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="companies"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
