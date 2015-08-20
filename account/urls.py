from django.conf.urls import url
from django.core.urlresolvers import reverse
from django.contrib.auth import views as auth_views
from . import views


urlpatterns = [
    url(r'^$', views.DefaultRedirectView.as_view(), name='default_page'),
    url(r'^(?P<pk>[0-9]+)/$', views.ProfileView.as_view(), name='profile'),
    url(r'^create_account/$', views.CreateAccountView.as_view(), name='create_account'),
    url(r'^update_account/$', views.UpdateAccountView.as_view(), name='update_account'),
    url(r'^login/$', views.LoginView.as_view(), name='login'),
    url(r'^logout/$', views.LogoutView.as_view(), name='logout'),
    url(r'^update_account/password/$', auth_views.password_change, {
        'template_name': 'account/change_password.html',
        'post_change_redirect': '/',
    }, name='change_password'),
    url(r'^password_reset/$', auth_views.password_reset, {
        'template_name': 'account/password_reset.html',
        'email_template_name': 'account/password_reset_email.html',
        'subject_template_name': 'account/password_reset_subject.txt',
        'post_reset_redirect': '/password_reset_done/',
    }, name='password_reset'),
    url(r'^password_reset_done/$', auth_views.password_reset_done, {
        'template_name': 'account/password_reset_done.html'
    }, name='password_reset_done'),
    url(r'^password_reset_confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        auth_views.password_reset_confirm, {
        'template_name': 'account/password_reset_confirm.html',
        'post_reset_redirect': '/password_reset_complete/'
    }, name='password_reset_confirm'),
    url(r'^password_reset_complete/$', auth_views.password_reset_complete, {
        'template_name': 'account/password_reset_complete.html'
    }, name='password_reset_complete'),
]
