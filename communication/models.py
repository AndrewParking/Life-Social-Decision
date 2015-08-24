from django.db import models
from account.models import Account

# Create your models here.

class Message(models.Model):
    from_account = models.ForeignKey(Account, related_name='messages_sent')
    to_account = models.ForeignKey(Account, related_name='messages_got')
    content = models.TextField()
    sending_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if len(self.content) < 31:
            return self.content
        else:
            return self.content[:30]


class Notification(models.Model):
    to_account = models.ForeignKey(Account)
    summary = models.CharField(max_length=200)
    content = models.TextField()
    sending_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.summary
