from django.core.urlresolvers import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from account.models import Account
from .models import Message


class MessagesViewSetTest(APITestCase):

    def setUp(self):
        self.user = Account.objects.create_user(
            email='pop1111@tut.by',
            phone='+375333172375',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )
        self.another_user = Account.objects.create_user(
            email='popow.andre211@yahoo.com',
            phone='+34532143343',
            first_name='Andzei',
            last_name='Sapkowski',
            password='homm1994'
        )
        self.one_more_user = Account.objects.create_user(
            email='yandex1066@mail.ru',
            phone='+31234984434',
            first_name='Nick',
            last_name='Concord',
            password='homm1994'
        )
        self.message = Message.objects.create(
            from_account=self.user,
            to_account=self.another_user,
            content='Some message'
        )
        self.another_message = Message.objects.create(
            from_account=self.another_user,
            to_account=self.user,
            content='Some other message'
        )

    def test_returns_403_to_anon_user(self):
        response = self.client.get(reverse('communication:messages-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_returns_data_when_get(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('communication:messages-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        response_data = [dict(mes) for mes in response.data]
        self.assertEqual(response_data, [
            {
                'id': self.message.id,
                'to_account': self.another_user.id,
                'content': 'Some message'
            },
            {
                'id': self.another_message.id,
                'to_account': self.user.id,
                'content': 'Some other message'
            }
        ])

    def test_list_returns_nothing_when_not_connected(self):
        self.client.force_authenticate(user=self.one_more_user)
        response = self.client.get(reverse('communication:messages-list'))
        self.assertEqual(len(response.data), 0)

    def test_detail_returns_404_when_not_connected(self):
        self.client.force_authenticate(user=self.one_more_user)
        response = self.client.get(reverse('communication:messages-detail', kwargs={'pk': self.message.id,}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_creates_message_when_valid_post(self):
        self.client.force_authenticate(user=self.one_more_user)
        data = {
            'to_account': self.another_user.id,
            'content': 'Post checking message'
        }
        response = self.client.post(reverse('communication:messages-list'), data)
        message = Message.objects.last()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(message.to_account, self.another_user)
        self.assertEqual(message.content, data['content'])

    def test_perform_create_fills_from_account_field(self):
        self.client.force_authenticate(user=self.one_more_user)
        data = {
            'to_account': self.another_user.id,
            'content': 'Post checking message'
        }
        self.client.post(reverse('communication:messages-list'), data)
        message = Message.objects.last()
        self.assertEqual(message.from_account, self.one_more_user)

    def test_incoming_messages_method(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('communication:messages-list')+'incoming/')
        response_data = [dict(mes) for mes in response.data]
        self.assertEqual(len(response_data), 1)
        self.assertEqual(response_data[0]['content'], 'Some other message')
        self.assertEqual(dict(response_data[0]['from_account'])['id'], self.another_user.id)

    def test_outcoming_messages_method(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('communication:messages-list')+'outcoming/')
        response_data = [dict(mes) for mes in response.data]
        self.assertEqual(len(response_data), 1)
        self.assertEqual(response_data[0]['content'], 'Some message')
        self.assertEqual(dict(response_data[0]['to_account'])['id'], self.another_user.id)

    def test_read_method_with_incoming_message(self):
        self.client.force_authenticate(user=self.another_user)
        response = self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'read/')
        message = Message.objects.first()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(message.read)

    def test_read_method_with_outcoming_message(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'read/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_read_returns_403_to_anon_user(self):
        response = self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'read/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_read_does_not_touch_data_on_anon_request(self):
        response = self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'read/')
        message = Message.objects.first()
        self.assertFalse(message.read)

    # TODO: test deletes message when both removed

    def test_remove_returns_403_to_anon(self):
        response = self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'remove/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_does_not_touch_data_after_anon_request(self):
        response = self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'remove/')
        message = Message.objects.first()
        self.assertFalse(message.removed_to)
        self.assertFalse(message.removed_from)

    def test_returns_403_to_foreign_user_request(self):
        self.client.force_authenticate(user=self.one_more_user)
        response = self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'remove/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_does_not_touch_data_after_foreign_user_request(self):
        self.client.force_authenticate(user=self.one_more_user)
        response = self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'remove/')
        message = Message.objects.first()
        self.assertFalse(message.removed_to)
        self.assertFalse(message.removed_from)

    def test_changes_removed_from_property(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'remove/')
        message = Message.objects.first()
        self.assertTrue(message.removed_from)

    def test_changes_removed_to_property(self):
        self.client.force_authenticate(user=self.another_user)
        response = self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'remove/')
        message = Message.objects.first()
        self.assertTrue(message.removed_to)

    def test_is_not_fetched_as_incoming_when_removed(self):
        self.client.force_authenticate(user=self.another_user)
        self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'remove/')
        response = self.client.get(reverse('communication:messages-list')+'incoming/')
        self.assertEqual(len(response.data), 0)
        self.assertEqual(response.data, [])

    def test_is_not_fetched_as_outcoming_when_removed(self):
        self.client.force_authenticate(user=self.user)
        self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'remove/')
        response = self.client.get(reverse('communication:messages-list')+'outcoming/')
        self.assertEqual(len(response.data), 0)
        self.assertEqual(response.data, [])

    def test_remove_deletes_instance_when_both_removed(self):
        self.client.force_authenticate(user=self.another_user)
        self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'remove/')
        self.client.force_authenticate(user=self.user)
        self.client.patch(reverse('communication:messages-detail', args=(self.message.id,))+'remove/')
        self.assertRaises(
            Message.DoesNotExist,
            Message.objects.get,
            pk=self.message.id
        )


class MessagesViewTest(TestCase):

    def test_redirects_anon_user(self):
        response = self.client.get(reverse('communication:messages_list'))
        self.assertRedirects(response, reverse('account:login'))

    def test_renders_right_template(self):
        user = Account.objects.create_user(
            email='pop1111@tut.by',
            phone='+375333172375',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )
        self.client.login(email=user.email, password='homm1994')
        response = self.client.get(reverse('communication:messages_list'))
        self.assertTemplateUsed(response, 'account/messages.html')
