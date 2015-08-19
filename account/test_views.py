from django.test import TestCase
from django.test.client import RequestFactory
from django.core.urlresolvers import reverse
from .views import CreateAccountView
from .models import Account

# ===========================================
# ================= Mixins ==================
# ===========================================

class CreateValidUserMixin(object):

    def create_valid_user(self):
        self.user = Account.objects.create_user(
            email='pop@tut.by',
            phone='+375333172375',
            password='homm1994'
        )


# ===========================================
# ================== Tests ==================
# ===========================================


class DefaultRedirectViewTest(CreateValidUserMixin, TestCase):

    def test_redirects_anon_user(self):
        response = self.client.get(reverse('account:default_page'))
        self.assertRedirects(response, reverse('account:create_account'))

    def test_redirects_authed_user(self):
        self.create_valid_user()
        self.client.login(email=self.user.email, password='homm1994')
        response = self.client.get(reverse('account:default_page'))
        self.assertRedirects(response, reverse('account:profile', args=(self.user.id,)))


class ProfileViewTest(CreateValidUserMixin, TestCase):

    def test_redirects_anon_user(self):
        self.create_valid_user()
        response = self.client.get(reverse('account:profile', args=(self.user.id,)))
        self.assertRedirects(response, reverse('account:create_account'))


    def test_renders_right_template(self):
        self.create_valid_user()
        self.client.login(email=self.user.email, password='homm1994')
        response = self.client.get(reverse('account:profile', args=(self.user.id,)))
        self.assertTemplateUsed(response, 'profile.html')


class CreateAccountViewTest(CreateValidUserMixin, TestCase):

    def test_renders_right_template(self):
        response = self.client.get(reverse('account:create_account'))
        self.assertTemplateUsed(response, 'account/create_account.html')

    def test_redirects_authed_user(self):
        self.create_valid_user()
        self.client.login(email=self.user.email, password='homm1994')
        response = self.client.get(reverse('account:create_account'))
        self.assertRedirects(response, reverse('account:profile', args=(self.user.id,)))

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


class UpdateAccountViewTest(CreateValidUserMixin, TestCase):

    def test_redirects_anon_user(self):
        response = self.client.get(reverse('account:update_account'))
        self.assertRedirects(response, reverse('account:create_account'))

    def test_renders_right_template(self):
        self.create_valid_user()
        self.client.login(email=self.user.email, password='homm1994')
        response = self.client.get(reverse('account:update_account'))
        self.assertTemplateUsed(response, 'account/update_account.html')

    def test_renders_template_when_form_is_invalid(self):
        self.create_valid_user()
        self.client.login(email=self.user.email, password='homm1994')
        response = self.client.post(reverse('account:update_account'), {
            'email': ''
        })
        self.assertTemplateUsed(response, 'account/update_account.html')


class LoginViewTest(CreateValidUserMixin, TestCase):

    def test_redirects_authed_user(self):
        self.create_valid_user()
        self.client.login(email=self.user.email, password='homm1994')
        response = self.client.get(reverse('account:login'))
        self.assertRedirects(response, reverse('account:profile', args=(self.user.id,)))

    def test_renders_right_template(self):
        response = self.client.get(reverse('account:login'))
        self.assertTemplateUsed(response, 'account/login.html')

    def test_authenticates_user_if_form_is_valid(self):
        self.create_valid_user()
        self.client.post(reverse('account:login'), {
            'username': 'pop@tut.by',
            'password': 'homm1994'
        })
        self.assertIn('_auth_user_id', self.client.session)

    def test_renders_template_when_form_is_invalid(self):
        self.create_valid_user()
        response = self.client.post(reverse('account:login'), {
            'username': 'pop@tut.by',
            'password': 'homm1995'
        })
        self.assertTemplateUsed(response, 'account/login.html')


class LogoutViewTest(CreateValidUserMixin, TestCase):

    def test_redirects_on_success(self):
        self.create_valid_user()
        self.client.login(email=self.user.email, password='homm1994')
        response = self.client.get(reverse('account:logout'))
        self.assertRedirects(response, reverse('account:login'))

    def test_logs_the_user_out(self):
        self.create_valid_user()
        self.client.login(email=self.user.email, password='homm1994')
        response = self.client.get(reverse('account:logout'))
        self.assertNotIn('_auth_user_id', self.client.session)
