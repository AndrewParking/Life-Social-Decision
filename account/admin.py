from django.contrib import admin
from .models import Account

# Register your models here.

class AccountAdmin(admin.ModelAdmin):
    fieldsets = (
        ('required', {
            'fields': ['email', 'phone', 'password'],
        }),
        ('unnecessary', {
            'fields': [
                'first_name',
                'last_name',
                'photo',
                'about',
                'vk_link',
                'fb_link',
                'in_link',
                'tw_link',
            ],
            'classes': ['collapse',]
        }),
    )
    list_display = ('email', 'phone', 'created_at')
    filter_by = ['created_at']


admin.site.register(Account, AccountAdmin)
