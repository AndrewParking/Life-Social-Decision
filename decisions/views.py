from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from .models import Decision, Vote, Choice
from .serializers import (
    DecisionSerializer,
    OwnDecisionSerializer,
    VoteSerializer,
    SeparateChoiceSerializer,
)
from .permissions import IsOwnerOrReadOnly, IsOwnerOrNotAllowed

# Create your views here.

class DecisionViewSet(viewsets.ModelViewSet):
    serializer_class = DecisionSerializer
    permission_classes = (IsOwnerOrReadOnly,)

    def get_queryset(self):
        return Decision.objects.all()

    @list_route(methods=['get'])
    def own_decisions(self, request):
        decisions = Decision.objects.filter(author=request.user)
        serializer = OwnDecisionSerializer(decisions, many=True)
        return Response(serializer.data)


    @detail_route(methods=['delete'])
    def cancel_vote(self, request, pk=None):
        """
        /decisions-api/decisions/2/cancel_vote/ - DELETE
        ------------------------------------------------------------------------
        Method is created to easily delete a vote on one particular decision.
        Decision is being found by id, while account id comes from request data.
        """
        decision = Decision.objects.get(pk=pk)
        try:
            vote = Vote.objects.get(decision=decision, author=request.user)
        except Vote.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            vote.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)


class ChoiceViewSet(viewsets.ModelViewSet):
    queryset = Choice.objects.all()
    serializer_class = SeparateChoiceSerializer


class VoteViewSet(viewsets.ModelViewSet):
    serializer_class = VoteSerializer
    permission_classes = (IsOwnerOrNotAllowed,)

    def perform_create(self, serializer):
        pk = serializer.validated_data['choice'].id
        decision = Choice.objects.get(pk=pk).decision
        serializer.save(author=self.request.user, decision=decision)

    def get_queryset(self):
        return Vote.objects.filter(author=self.request.user)
