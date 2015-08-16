from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.CreateAccountView.as_view(), name='create_account'),
]
