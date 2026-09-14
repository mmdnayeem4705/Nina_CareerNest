from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(APIView):
    def get(self, request):
        qs = Notification.objects.filter(user=request.user)[:50]
        unread = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response(
            {
                "unread": unread,
                "results": NotificationSerializer(qs, many=True).data,
            }
        )


class NotificationReadView(APIView):
    def post(self, request, pk):
        Notification.objects.filter(user=request.user, pk=pk).update(is_read=True)
        return Response({"ok": True})


class NotificationReadAllView(APIView):
    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"ok": True})
