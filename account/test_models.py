from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import Account


class AccountModelTest(TestCase):

    def test_creates_object_with_valid_data(self):
        account = Account.objects.create(
            username='Andrew',
            email='pop1111@tut.by',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )
        self.assertEqual(account.username, 'Andrew')
        self.assertEqual(account.email, 'pop1111@tut.by')
        self.assertEqual(account.first_name, 'Andrew')
        self.assertEqual(account.last_name, 'Popov')

    def test_creation_fails_with_invalid_data(self):
        account = Account(
            username='Andrew',
            email='pop1',
            password='ghtr'
        )
        self.assertRaises(ValidationError, account.save)

    def test_updates_object(self):
        account = Account.objects.create(
            username='Andrew',
            email='pop1111@tut.by',
            fist_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )
        account.first_name = 'Sam'
        account.save()
        self.assertEqual(account.first_name, 'Sam')
