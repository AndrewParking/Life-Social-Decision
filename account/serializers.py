from rest_framework import serializers
from .models import Account


class ShortFollowSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = ('id', 'display_name')


class FollowerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = (
            'email',
            'first_name',
            'last_name',
        )


class FollowingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = (
            'email',
            'first_name',
            'last_name',
        )


class AccountSerializer(serializers.ModelSerializer):
    followers = FollowerSerializer(many=True, read_only=True)
    following = FollowingSerializer(many=True, read_only=True)

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
            'following',
            'followers',
        )
