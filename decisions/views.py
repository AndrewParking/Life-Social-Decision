from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from .models import Decision, Vote, Choice
from .serializers import (
    DecisionSerializer,
    OwnDecisionSerializer,
    VoteSerializer,
    ChoiceSerializer,
    DeleteChoiceSerializer,
    UpdateChoiceSerializer,
)
from .permissions import (
    IsOwnerOrReadOnly,
    IsOwnerOfVoteOrDecisionOrNotAllowed,
    IsNotOwnerOfDecisionOrReadOnly,
    IsAuthenticatedOrNotAllowed,
    ReadListOnlyIfAlreadyVoted,
)

# Create your views here.

class DecisionViewSet(viewsets.ModelViewSet):
    serializer_class = DecisionSerializer
    permission_classes = (IsAuthenticatedOrNotAllowed, IsOwnerOrReadOnly,)

    def get_queryset(self):
        return Decision.objects.all()

    @list_route(methods=['get'])
    def own_decisions(self, request):
        """
        /decisions-api/decisions/own_decisions/
        ------------------------------------------------------------------------
        This method is used to fetch all the decisions of the current user.
        """
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
        It is better to place it here, in decision viewset rather then in vote
        viewset because it will be much more comfortable to operate this way on
        the client side.
        """
        decision = get_object_or_404(Decision, pk=pk)
        vote = get_object_or_404(Vote, decision=decision, author=request.user)
        vote.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @detail_route(methods=['post'])
    def add_choice(self, request, pk=None):
        """
        /decisions-api/decisions/2/add_choice/ - POST
        ------------------------------------------------------------------------
        This method creates choice instance for this particular decision.
        Choice content comes with the POST data while decision id is fetched
        from request params(pk).
        """
        decision = get_object_or_404(Decision, pk=pk)
        if decision.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = ChoiceSerializer(data=request.data)
        if serializer.is_valid():
            Choice.objects.create(
                content=serializer.validated_data['content'],
                decision=decision
            )
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @detail_route(methods=['delete'])
    def remove_choice(self, request, pk=None):
        """
        /decisions-api/decisions/2/remove_choice/ - POST
        ------------------------------------------------------------------------
        This method removes choice instance of this particular decision.
        Choice id comes with the POST data and is serialized by
        DeleteChoiceSerializer while decision id is fetched from request
        params(pk).
        """
        decision = get_object_or_404(Decision, pk=pk)
        if request.user != decision.author:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = DeleteChoiceSerializer(data=request.data)
        if serializer.is_valid():
            id = serializer.validated_data['id']
            choice = get_object_or_404(Choice, pk=id)
            choice.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @detail_route(methods=['patch'])
    def update_choice(self, request, pk=None):
        """
        /decisions-api/decisions/2/update_choice/ - PATCH
        ------------------------------------------------------------------------
        This method updates choice instance of this particular decision.
        Choice id comes with the POST data along with new content. They are
        serialized by UpdateChoiceSerializer while decision id is fetched from
        request params(pk).
        """
        decision = get_object_or_404(Decision, pk=pk)
        if request.user != decision.author:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = UpdateChoiceSerializer(data=request.data)
        if serializer.is_valid():
            id = serializer.validated_data['id']
            choice = get_object_or_404(Choice, pk=id)
            choice.content = serializer.validated_data['content']
            choice.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class VoteViewSet(viewsets.ModelViewSet):
    serializer_class = VoteSerializer
    permission_classes = (
        IsAuthenticatedOrNotAllowed,
        IsOwnerOfVoteOrDecisionOrNotAllowed,
        IsNotOwnerOfDecisionOrReadOnly,
        ReadListOnlyIfAlreadyVoted,
    )

    def perform_create(self, serializer):
        pk = serializer.validated_data['choice'].id
        decision = Choice.objects.get(pk=pk).decision
        serializer.save(author=self.request.user, decision=decision)

    def get_queryset(self):
        return Vote.objects.filter(author=self.request.user)
