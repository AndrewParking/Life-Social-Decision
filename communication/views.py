from django.shortcuts import render
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer, AjaxMessageSerializer
from .permissions import IsConnectedOrNotAllowed, IsAuthenticatedOrNotAllowed

# Create your views here.

class MessagesViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = (IsConnectedOrNotAllowed, IsAuthenticatedOrNotAllowed)

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(Q(from_account=user)|Q(to_account=user))

    def perform_create(self, serializer):
        serializer.save(from_account=self.request.user)

    @list_route(methods=['get'])
    def incoming(self, request):
        data = Message.objects.filter(to_account=request.user)
        serializer = AjaxMessageSerializer(data, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def outcoming(self, request):
        data = Message.objects.filter(from_account=request.user)
        serializer = AjaxMessageSerializer(data, many=True)
        return Response(serializer.data)
