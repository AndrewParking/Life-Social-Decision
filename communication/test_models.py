from django.test import TestCase
from django.db.utils import IntegrityError
from account.models import Account
from .models import Message, Notification


class MessageModelTest(TestCase):

    def setUp(self):
        self.from_account = Account.objects.create_user(
            email='pop1111@tut.by',
            phone='+375333172375',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )
        self.to_account = Account.objects.create_user(
            email='popow.andre211@yahoo.com',
            phone='+34532143343',
            first_name='Andzei',
            last_name='Sapkowski',
            password='homm1994'
        )

    def test_creates_message_instance(self):
        message = Message.objects.create(
            from_account=self.from_account,
            to_account=self.to_account,
            content='Aaamen, heeey man'
        )
        self.assertEqual(message.from_account, self.from_account)
        self.assertEqual(message.to_account, self.to_account)
        self.assertEqual(message.content, 'Aaamen, heeey man')

    def test_creation_fails_without_from_account(self):
        self.assertRaises(
            IntegrityError,
            Message.objects.create,
            to_account=self.to_account,
            content='lalalala'
        )

    def test_creation_fails_without_to_account(self):
        self.assertRaises(
            IntegrityError,
            Message.objects.create,
            from_account=self.from_account,
            content='say hi man'
        )

    def test_updates_message_object(self):
        message = Message.objects.create(
            from_account=self.from_account,
            to_account=self.to_account,
            content='Aaamen, heeey man'
        )
        message.content = 'New content'
        message.save()
        self.assertEqual(message.content, 'New content')

    def test_short_str(self):
        message = Message.objects.create(
            from_account=self.from_account,
            to_account=self.to_account,
            content='Aaamen, heeey man'
        )
        self.assertEqual(message.__str__(), 'Aaamen, heeey man')

    def test_long_str(self):
        message = Message.objects.create(
            from_account=self.from_account,
            to_account=self.to_account,
            content='Facebook bounty hunter Laxman Muthiyah from India has \
            recently discovered his third bug of this year in the widely \
            popular social network website that just made a new record by \
            touching 1 Billion users in a single day.'
        )
        self.assertEqual(message.__str__(), message.content[:30])

class NotificationModelTest(TestCase):

    def setUp(self):
        self.to_account = Account.objects.create_user(
            email='pop1111@tut.by',
            phone='+375333172375',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )
        self.summary = 'Notofication heading'
        self.content = 'Some not so long text which describes the issue'

    def test_creates_notification_instance(self):
        notification = Notification.objects.create(
            to_account=self.to_account,
            summary=self.summary,
            content=self.content
        )
        self.assertEqual(notification.summary, self.summary)
        self.assertEqual(notification.content, self.content)
        self.assertEqual(notification.to_account, self.to_account)

    def test_creation_fails_without_to_account(self):
        self.assertRaises(
            IntegrityError,
            Notification.objects.create,
            summary=self.summary,
            content=self.content
        )

    def test_updates_notification_objects(self):
        notification = Notification.objects.create(
            to_account=self.to_account,
            summary=self.summary,
            content=self.content
        )
        notification.summary = 'a'
        notification.content = 'a'
        notification.save()
        self.assertEqual(notification.summary, 'a')
        self.assertEqual(notification.content, 'a')

    def test_str(self):
        notification = Notification.objects.create(
            to_account=self.to_account,
            summary=self.summary,
            content=self.content
        )
        self.assertEqual(notification.__str__(), self.summary)
