from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.DefaultRedirectView.as_view(), name='default_page'),
    url(r'^(?P<pk>[0-9]+)/$', views.ProfileView.as_view(), name='profile'),
    url(r'^create_account/$', views.CreateAccountView.as_view(), name='create_account'),
    url(r'^update_account/$', views.UpdateAccountView.as_view(), name='update_account'),
]
