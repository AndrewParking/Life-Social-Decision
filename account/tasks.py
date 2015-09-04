from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import Account


@shared_task
def send_login_email(id):
    user = Account.objects.get(pk=id)
    subject, from_email, to_email = 'Logging in', 'popow.andrej2009@gmail.com', user.email
    html_content = render_to_string('account/login_email.html', {'user': user})
    text_content = strip_tags(html_content)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
    msg.attach_alternative(html_content, 'text/html')
    msg.send()
