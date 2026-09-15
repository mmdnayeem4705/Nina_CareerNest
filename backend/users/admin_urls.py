from django.urls import path

from .admin_views import (
    AdminCompanyListView,
    AdminApplicationListView,
    AdminJobListView,
    AdminJobToggleView,
    AdminStatsView,
    AdminUserBlockView,
    AdminUserListView,
)

urlpatterns = [
    path("stats/", AdminStatsView.as_view()),
    path("users/", AdminUserListView.as_view()),
    path("users/<int:pk>/block/", AdminUserBlockView.as_view()),
    path("companies/", AdminCompanyListView.as_view()),
    path("jobs/", AdminJobListView.as_view()),
    path("jobs/<int:pk>/toggle/", AdminJobToggleView.as_view()),
    path("applications/", AdminApplicationListView.as_view()),
]
