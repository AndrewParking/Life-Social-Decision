from django import forms
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Account


class CreateAccountForm(UserCreationForm):

    class Meta:
        model = Account
        fields = (
            'email',
            'first_name',
            'last_name',
            'phone',
            'photo',
            'tagline',
            'about',
            'vk_link',
            'tw_link',
            'fb_link',
            'in_link',
        )

    def __init__(self, *args, **kwargs):
        if kwargs.get('request'):
            self.request = kwargs.pop('request')
        return super(CreateAccountForm, self).__init__(*args, **kwargs)

    def login_user(self):
        email = self.cleaned_data['email']
        password = self.cleaned_data['password1']
        user = authenticate(
            username=email,
            password=password
        )
        login(self.request, user)


class UpdateAccountForm(UserChangeForm):

    def clean_password(self):
        return self.initial.get('password')

    class Meta:
        model = Account
        fields = (
            'email',
            'first_name',
            'last_name',
            'phone',
            'photo',
            'tagline',
            'about',
            'vk_link',
            'tw_link',
            'fb_link',
            'in_link',
        )
