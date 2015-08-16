from django.test import TestCase
from .form import CreateAccountForm

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
