from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import Account


class AccountModelTest(TestCase):

    def test_can_create_ordinary_user(self):
        account = Account.objects.create_user(
            email='pop1111@tut.by',
            password='homm1994',
            phone='+375333172375',
            first_name='Andrew',
            last_name='Popov',
        )
        self.assertEqual(account.email, 'pop1111@tut.by')
        self.assertEqual(account.phone, '+375333172375')
        self.assertEqual(account.first_name, 'Andrew')
        self.assertEqual(account.last_name, 'Popov')

    def test_can_create_superuser(self):
        account = Account.objects.create_superuser(
            email='pop1111@tut.by',
            phone='+375333172375',
            password='homm1994'
        )
        self.assertEqual(account.email, 'pop1111@tut.by')
        self.assertEqual(account.phone, '+375333172375')
        self.assertTrue(account.is_admin)
        self.assertTrue(account.is_staff)

    def test_creation_fails_without_email(self):
        self.assertRaises(
            TypeError,
            Account.objects.create_user,
            phone='+375333172375',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )

    def test_save_fails_without_email(self):
        account = Account(
            phone='+375333172375',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )
        self.assertRaises(ValidationError, account.save)

    def test_creation_fails_without_phone(self):
        self.assertRaises(
            ValidationError,
            Account.objects.create_user,
            email='pop@tut.by',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )

    def test_save_fails_without_phone(self):
        account = Account(
            email='pop@tut.by',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )
        self.assertRaises(ValidationError, account.save)

    def test_creation_fails_with_invalid_data(self):
        self.assertRaises(
            ValidationError,
            Account.objects.create_user,
            email='',
            phone='+375333172375',
            password='ghtr'
        )

    def test_updates_object(self):
        account = Account.objects.create_user(
            email='pop1111@tut.by',
            phone='+375333172375',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )
        account.first_name = 'Sam'
        account.save()
        self.assertEqual(account.first_name, 'Sam')

    def test_str(self):
        account = Account.objects.create_user(
            email='pop1111@tut.by',
            phone='+375333172375',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )
        self.assertEqual(account.__str__(), 'pop1111@tut.by')

    def test_get_short_name(self):
        account = Account.objects.create(
            email='pop1111@tut.by',
            phone='+375333172375',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )
        self.assertEqual(account.get_short_name(), 'Andrew')

    def test_get_full_name(self):
        account = Account.objects.create(
            email='pop1111@tut.by',
            phone='+375333172375',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )
        self.assertEqual(account.get_full_name(), 'Andrew Popov')
