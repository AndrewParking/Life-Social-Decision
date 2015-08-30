from rest_framework import serializers
from .models import Decision, Choice, Vote


class ChoiceSerializer(serializers.ModelSerializer):
    votes = serializers.ReadOnlyField(source='votes_count')

    class Meta:
        model = Choice
        fields = (
            'id',
            'content',
            'votes'
        )

class SeparateChoiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Choice
        fields = (
            'id',
            'content',
            'decision'
        )


class DecisionSerializer(serializers.ModelSerializer):
    """
    This serializer class will be used in all the operations with Decision
    model instances except fetching the current user's own decisions.
    """
    choices = ChoiceSerializer(many=True)
    author = serializers.StringRelatedField(read_only=True)
    already_voted = serializers.SerializerMethodField()

    class Meta:
        model = Decision
        fields = (
            'id',
            'heading',
            'content',
            'created_at',
            'author',
            'choices',
            'already_voted',
        )

    def create(self, validated_data):
        """
        We provide create method to be able to create choice objects got from
        nested serialization.
        """
        choices_data = validated_data.pop('choices')
        decision = Decision.objects.create(author=self.context['request'].user, **validated_data)
        for choice in choices_data:
            Choice.objects.create(decision=decision, content=choice['content'])
        return decision

    def get_already_voted(self, obj):
        """
        get_already_voted method helps to identify whether the current user has
        already voted on this particular decision or not.
        """
        try:
            user = self.context['request'].user
            vote = Vote.objects.get(
                author=user,
                decision=obj
            )
        except Vote.DoesNotExist:
            return False
        else:
            return True


class OwnDecisionSerializer(serializers.ModelSerializer):
    """
    This serializer class is only used for serializing current user's decisions.
    That's why we don't need the fields 'author' and 'already_voted' here. We
    also drop the create method because this serializer isn't used for data
    manipulation with unsafe methods.
    """
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = Decision
        fields = (
            'id',
            'heading',
            'content',
            'created_at',
            'choices',
        )


class VoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vote
        fields = (
            'choice',
        )
