from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == obj.author


class IsOwnerOrNotAllowed(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if obj.author == request.user:
            return True
        return False
