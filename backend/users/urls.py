from django.urls import path

from .views import CandidateProfileView, CandidatePublicView, LoginView, MeView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
    path("profile/", CandidateProfileView.as_view(), name="candidate-profile"),
    path("candidates/<int:pk>/", CandidatePublicView.as_view(), name="candidate-public"),
]
