from rest_framework import serializers
from account.serializers import ShortSerializer
from account.models import Account
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    """
    This serializer is only used for messages creation
    """
    to_account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all())

    class Meta:
        model = Message
        fields = (
            'id',
            'to_account',
            'content',
        )


class AjaxMessageSerializer(serializers.ModelSerializer):
    """
    This serializer is used for fetching messages data from server using ajax
    """
    from_account = ShortSerializer(read_only=True)
    to_account = ShortSerializer(read_only=True)

    class Meta:
        model = Message
        fields = (
            'id',
            'from_account',
            'to_account',
            'content',
            'read',
            'removed_from',
            'removed_to',
            'sending_date'
        )
