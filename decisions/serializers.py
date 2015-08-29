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
        choices_data = validated_data.pop('choices')
        decision = Decision.objects.create(author=self.context['request'].user, **validated_data)
        for choice in choices_data:
            Choice.objects.create(decision=decision, content=choice['content'])
        return decision

    def get_already_voted(self, obj):
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



class VoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vote
        fields = (
            'choice',
        )
