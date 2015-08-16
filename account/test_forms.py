from django.test import TestCase
from .forms import CreateAccountForm, UpdateAccountForm

class CreateAccountFormTest(TestCase):

    def test_form_with_empty_data(self):
        form = CreateAccountForm()
        self.assertFalse(form.is_valid())

    def test_form_with_valid_data(self):
        form = CreateAccountForm({
            'email': 'pop111@tut.by',
            'phone': '+375333172375',
            'password1': 'homm1994',
            'password2': 'homm1994'
        })
        self.assertTrue(form.is_valid())

    def test_form_with_valid_data(self):
        form = CreateAccountForm({
            'email': 'pop111@tut.by',
            'phone': '+375333172375',
            'password1': 'homm1994',
            'password2': 'witcher1994'
        })
        self.assertFalse(form.is_valid())


class UpdateAccountFormTest(TestCase):

    def test_form_with_empty_data(self):
        form = UpdateAccountForm()
        self.assertFalse(form.is_valid())

    def test_form_with_valid_data(self):
        form = UpdateAccountForm({
            'email': 'pop111@tut.by',
            'phone': '+375333172375',
            'first_name': 'Andrew'
        })
        self.assertTrue(form.is_valid())

    def test_form_with_invalid_data(self):
        form = UpdateAccountForm({
            'tagline': 'we do not saw'
        })
        self.assertFalse(form.is_valid())
