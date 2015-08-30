from django.shortcuts import render
from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponseRedirect
from django.db.models import Q
from django.views.generic.base import TemplateView
from rest_framework import viewsets, status
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer, AjaxMessageSerializer
from .permissions import IsConnectedOrNotAllowed, IsAuthenticatedOrNotAllowed

# Create your views here.


class MessagesView(TemplateView):
    """
    View to just render template. React staff does the rest of the job
    """
    template_name = 'account/messages.html'

    def dispatch(self, *args, **kwargs):
        user = self.request.user
        if not user.is_authenticated():
            return HttpResponseRedirect(reverse_lazy('account:login'))
        return super(MessagesView, self).dispatch(*args, **kwargs)


class MessagesViewSet(viewsets.ModelViewSet):
    """
    Main API view to interact with messages model in database through AJAX
    """
    serializer_class = MessageSerializer
    permission_classes = (IsConnectedOrNotAllowed, IsAuthenticatedOrNotAllowed)

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(Q(from_account=user)|Q(to_account=user))

    def perform_create(self, serializer):
        serializer.save(from_account=self.request.user)

    @list_route(methods=['get'])
    def incoming(self, request):
        """
        /communication/messages/incoming/ - GET
        ------------------------------------------------------------------------
        This url route function fetches all incoming messages for account which is
        currently logged in.
        """
        data = Message.objects.filter(Q(to_account=request.user) & Q(removed_to=False))
        serializer = AjaxMessageSerializer(data, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def outcoming(self, request):
        """
        /communication/messages/outcoming/ - GET
        ------------------------------------------------------------------------
        This url route function fetches all outcoming messages for account which is
        currently logged in.
        """
        data = Message.objects.filter(Q(from_account=request.user) & Q(removed_from=False))
        serializer = AjaxMessageSerializer(data, many=True)
        return Response(serializer.data)

    @detail_route(methods=['patch'])
    def read(self, request, pk=None):
        """
        /communication/messages/2/read/ - PATCH
        ------------------------------------------------------------------------
        This url route function marks the message as already read.
        """
        try:
            message = Message.objects.get(pk=pk)
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            if not message.to_account == request.user:
                return Response(status=status.HTTP_403_FORBIDDEN)
            else:
                message.read = True
                message.save()
                return Response(status=status.HTTP_200_OK)

    @detail_route(methods=['patch'])
    def remove(self, request, pk=None):
        """
        /communication/messages/2/remove/ - PATCH
        ------------------------------------------------------------------------
        This function places True value to removed_... database field. It
        means that this message will never be fetched by ajax call for this
        particular account any more. We cannot just delete it because such an
        action will remove it from the list of both sender and receiver.
        """
        try:
            message = Message.objects.get(pk=pk)
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            if message.from_account == request.user:
                message.removed_from = True
            elif message.to_account == request.user:
                message.removed_to = True
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
            message.save()
            if message.removed_to and message.removed_from:
                message.delete()
            return Response(status=status.HTTP_200_OK)
