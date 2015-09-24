from django.contrib import admin
from .models import Message, Notification


class MessageAdmin(admin.ModelAdmin):
	fieldsets = [
		('Required', {
			'fields': ('content', 'from_account', 'to_account'),
		}),
		('Unnecessary', {
			'fields': ('read', 'removed_from', 'removed_to', 'sending_date'),
			'classes': ('collapse',)
		}),
	]
	list_display = ('from_account', 'to_account', 'read', 'sending_date')
	filter_by = ['sending_date']


class NotificationAdmin(admin.ModelAdmin):
	fields = ('to_account', 'summary', 'content')
	list_display = ('to_account', 'summary', 'sending_date')
	filter_by = ['sending_date']


admin.site.register(Message, MessageAdmin)
admin.site.register(Notification, NotificationAdmin)
