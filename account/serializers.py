from rest_framework import serializers
from .models import Account


class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'phone',
            'photo',
            'tagline',
            'about',
            'vk_link',
            'tw_link',
            'fb_link',
            'in_link',
        )
