from django.urls import path

from .views import MatchPreviewView, RecruiterResumeDownloadView, ResumeUploadView

urlpatterns = [
    path("", ResumeUploadView.as_view()),
    path("match/<int:pk>/", MatchPreviewView.as_view()),
    path("applications/<int:pk>/download/", RecruiterResumeDownloadView.as_view()),
]
