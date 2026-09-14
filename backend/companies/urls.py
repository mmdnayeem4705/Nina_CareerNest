from django.urls import path

from .views import CompanyDetailView, CompanyMeView

urlpatterns = [
    path("me/", CompanyMeView.as_view()),
    path("<int:pk>/", CompanyDetailView.as_view()),
]
