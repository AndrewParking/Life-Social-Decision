from django.conf.urls import url
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
]
