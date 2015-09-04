from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from account.models import Account
from .models import Message


@shared_task
def in_message_notification(id):
    user = Account.objects.get(pk=id)
    subject, from_email, to_email = 'New message', 'popow.andrej2009@gmail.com', user.email
    message = Message.objects.filter(to_account=user).last()
    html_content = render_to_string('account/in_message_email.html', {
        'user': user,
        'from_user': message.from_account,
        'message': message,
    })
    text_content = strip_tags(html_content)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
    msg.attach_alternative(html_content, 'text/html')
    msg.send()
