from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import IsRecruiter

from .models import Company
from .serializers import CompanySerializer


class CompanyMeView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsRecruiter()]

    def get(self, request):
        if request.user.role != "recruiter":
            return Response({"detail": "Not a recruiter."}, status=status.HTTP_400_BAD_REQUEST)
        company = Company.objects.filter(owner=request.user).order_by("id").first()
        if not company:
            company = Company.objects.create(owner=request.user, name=f"{request.user.first_name or 'My'} Company")
        return Response(CompanySerializer(company).data)

    def patch(self, request):
        company = Company.objects.filter(owner=request.user).order_by("id").first()
        if not company:
            company = Company.objects.create(owner=request.user, name="My Company")
        serializer = CompanySerializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class CompanyDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            company = Company.objects.get(pk=pk)
        except Company.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(CompanySerializer(company).data)
