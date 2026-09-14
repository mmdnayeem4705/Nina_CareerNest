from django.urls import path

from .views import (
    ApplicationStatusView,
    ApplyView,
    MyApplicationsView,
    RecruiterApplicantsView,
    ScheduleInterviewView,
)

urlpatterns = [
    path("mine/", MyApplicationsView.as_view()),
    path("jobs/<int:pk>/apply/", ApplyView.as_view()),
    path("jobs/<int:pk>/applicants/", RecruiterApplicantsView.as_view()),
    path("<int:pk>/status/", ApplicationStatusView.as_view()),
    path("<int:pk>/interview/", ScheduleInterviewView.as_view()),
]
