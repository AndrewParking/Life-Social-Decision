from django.test import TestCase
from django.test.client import RequestFactory
from django.core.urlresolvers import reverse
from .views import CreateAccountView
from .models import Account


class DefaultRedirectViewTest(TestCase):

    def test_redirects_anon_user(self):
        response = self.client.get(reverse('account:default_page'))
        self.assertRedirects(response, reverse('account:create_account'))


    def test_redirects_authed_user(self):
        self.user = Account.objects.create_user(
            email='pop@tut.by',
            phone='+375333172375',
            password='homm1994'
        )
        self.client.login(email=self.user.email, password='homm1994')
        response = self.client.get(reverse('account:default_page'))
        self.assertRedirects(response, reverse('account:profile', args=(self.user.id,)))


class ProfileViewTest(TestCase):

    def test_redirects_anon_user(self):
        account = Account.objects.create_user(
            email='pop@tut.by',
            phone='+375333172375',
            password='homm1994'
        )
        response = self.client.get(reverse('account:profile', args=(account.id,)))
        self.assertRedirects(response, reverse('account:create_account'))


    def test_renders_right_template(self):
        self.user = Account.objects.create_user(
            email='pop@tut.by',
            phone='+375333172375',
            password='homm1994'
        )
        self.client.login(email=self.user.email, password='homm1994')
        response = self.client.get(reverse('account:profile', args=(self.user.id,)))
        self.assertTemplateUsed(response, 'profile.html')


class CreateAccountViewTest(TestCase):

    def setUp(self):
        self.factory = RequestFactory()

    def test_renders_right_template(self):
        response = self.client.get(reverse('account:create_account'))
        self.assertTemplateUsed(response, 'account/create_account.html')

    # def test_redirects_authed_user(self):
        # the body of the test

    def test_creates_user_if_form_is_valid(self):
        response = self.client.post(reverse('account:create_account'), {
            'email': 'pop111@tut.by',
            'phone': '+375333172375',
            'password1': 'homm1994',
            'password2': 'homm1994'
        })
        account = Account.objects.last()
        self.assertEqual(account.email, 'pop111@tut.by')
        self.assertEqual(account.phone, '+375333172375')

    def test_authenticates_user_if_form_is_valid(self):
        response = self.client.post(reverse('account:create_account'), {
            'email': 'pop111@tut.by',
            'phone': '+375333172375',
            'password1': 'homm1994',
            'password2': 'homm1994'
        })
        self.assertIn('_auth_user_id', self.client.session)

    def test_rerenders_template_if_form_is_invalid(self):
        response = self.client.post(reverse('account:create_account'), {
            'email': 'pop111@tut.by',
            'phone': '+375333172375',
            'password1': 'homm1994',
            'password2': 'homm1995'
        })
        self.assertTemplateUsed(response, 'account/create_account.html')
