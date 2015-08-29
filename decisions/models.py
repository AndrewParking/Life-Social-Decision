from django.db import models
from account.models import Account

# Create your models here.

class Decision(models.Model):
    heading = models.CharField(max_length=200)
    content = models.TextField()
    media = models.ImageField(default='/static/images/no-post-avatar.png')
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(Account)

    def __str__(self):
        return self.heading


class Choice(models.Model):
    decision = models.ForeignKey(Decision, related_name='choices')
    content = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content

    @property
    def votes_count(self):
        return self.votes.count()


class Vote(models.Model):
    decision = models.ForeignKey(Decision)
    choice = models.ForeignKey(Choice, related_name='votes')
    author = models.ForeignKey(Account)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '%s <-> %s' % (self.choice.content, self.author.short_display_name)

    class Meta:
        unique_together = (('decision', 'author'),)
