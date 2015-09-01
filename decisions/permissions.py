from rest_framework import permissions
from .models import Choice, Vote


class ReadListOnlyIfAlreadyVoted(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        try:
            choice = Choice.objects.get(pk=request.data['choice'])
            Vote.objects.get(decision=choice.decision, author=request.user)
        except Vote.DoesNotExist:
            return True
        else:
            return False


class IsNotOwnerOfDecisionOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        choice = Choice.objects.get(pk=request.data['choice'])
        return request.user != choice.decision.author


    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user != obj.decision.author


class IsAuthenticatedOrNotAllowed(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.user.is_authenticated():
            return True
        return False


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == obj.author


class IsOwnerOfVoteOrDecisionOrNotAllowed(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if obj.author == request.user or obj.decision.author == request.user:
            return True
        return False
