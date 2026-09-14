from django.urls import path

from .views import (
    BookmarkToggleView,
    JobDetailView,
    JobListView,
    RecruiterJobDetailView,
    RecruiterJobListCreateView,
    SavedJobsView,
)

urlpatterns = [
    path("", JobListView.as_view()),
    path("mine/", RecruiterJobListCreateView.as_view()),
    path("saved/", SavedJobsView.as_view()),
    path("mine/<int:pk>/", RecruiterJobDetailView.as_view()),
    path("<int:pk>/", JobDetailView.as_view()),
    path("<int:pk>/save/", BookmarkToggleView.as_view()),
]
