from rest_framework import permissions


class IsConnectedOrNotAllowed(permissions.BasePermission):

    def has_obj_permission(self, request, view, obj):
        if request.user == obj.from_account or request.user == obj.to_account:
            return True
        return False


class IsAuthenticatedOrNotAllowed(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.user.is_authenticated():
            return True
        return False
