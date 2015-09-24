from django.contrib import admin
from .models import Decision, Choice, Vote


class DecisionAdmin(admin.ModelAdmin):
	fields = ('heading', 'content', 'media', 'author')
	list_display = ('heading', 'author', 'created_at')
	filter_by = ['created_at']


class ChoiceAdmin(admin.ModelAdmin):
	fields = ('content', 'decision')
	list_display = ('content', 'decision', 'votes_count', 'created_at')
	filter_by = ['votes_count', 'created_at']


class VoteAdmin(admin.ModelAdmin):
	fields = ('decision', 'choice', 'author')
	list_display = ('decision', 'choice', 'author', 'created_at')
	filter_by = ['created_at']


admin.site.register(Decision, DecisionAdmin)
admin.site.register(Choice, ChoiceAdmin)
admin.site.register(Vote, VoteAdmin)
