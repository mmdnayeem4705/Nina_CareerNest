from rest_framework.permissions import BasePermission


class IsNotBlocked(BasePermission):
    message = "This account has been blocked."

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return True
        return not getattr(user, "is_blocked", False)


class IsCandidate(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "candidate" and not request.user.is_blocked


class IsRecruiter(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "recruiter" and not request.user.is_blocked


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "admin" and not request.user.is_blocked
