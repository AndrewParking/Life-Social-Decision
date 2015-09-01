from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from account.models import Account
from .models import Decision, Choice, Vote


class DecisionViewSetTest(APITestCase):

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
        self.decision = Decision.objects.create(
            heading='Programming langs',
            content='What programming language to choose',
            author=self.user
        )
        self.choice = Choice.objects.create(
            decision=self.decision,
            content='C++'
        )

    def test_returns_403_to_anon_user_get(self):
        response = self.client.get(reverse('decisions_api:decisions-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_returns_403_to_anon_user_post(self):
        response = self.client.post(reverse('decisions_api:decisions-list'), {
            'heading': 'Shoes brand',
            'content': 'What shoes to choose',
            'choices': [
                {
                    'content': 'Vans',
                },
                {
                    'content': 'Converse',
                }
            ]
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_does_not_touch_data_after_anon_post(self):
        self.client.post(reverse('decisions_api:decisions-list'), {
            'heading': 'Shoes brand',
            'content': 'What shoes to choose',
            'choices': [
                {
                    'content': 'Vans',
                },
                {
                    'content': 'Converse',
                }
            ]
        })
        self.assertEqual(Decision.objects.count(), 1)

    def test_returns_data_to_authed_get(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('decisions_api:decisions-list'))
        response_data = [dict(dec) for dec in response.data]
        self.assertEqual(response_data[0]['heading'], 'Programming langs')
        self.assertEqual(response_data[0]['content'], 'What programming language to choose')

    def test_creates_decision_when_authed_post(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(reverse('decisions_api:decisions-list'), {
            'heading': 'Shoes brand',
            'content': 'What shoes to choose',
            'choices': [
                {
                    'content': 'Vans',
                },
                {
                    'content': 'Converse',
                }
            ]
        })
        decision = Decision.objects.last()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(decision.heading, 'Shoes brand')
        self.assertEqual(decision.content, 'What shoes to choose')
        self.assertEqual(decision.choices.count(), 2)

    def test_returns_403_to_anon_as_own_decisions(self):
        response = self.client.get(reverse('decisions_api:decisions-list')+'own_decisions/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_fetches_own_decisions(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('decisions_api:decisions-list')+'own_decisions/')
        response_data = [dict(dec) for dec in response.data]
        self.assertEqual(len(response_data), 1)
        self.assertEqual(response_data[0]['heading'], 'Programming langs')
        self.assertEqual(response_data[0]['content'], 'What programming language to choose')

    def test_cancel_vote_returns_403_to_anon_user(self):
        response = self.client.delete(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'cancel_vote/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cancel_vote_does_not_touch_data_after_anon_request(self):
        vote = Vote.objects.create(
            decision=self.decision,
            choice=self.choice,
            author=self.another_user
        )
        self.client.delete(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'cancel_vote/'
        )
        self.assertEqual(Vote.objects.count(), 1)

    def test_cancel_vote_deletes_vote_instance(self):
        vote = Vote.objects.create(
            decision=self.decision,
            choice=self.choice,
            author=self.another_user
        )
        self.client.force_authenticate(user=self.another_user)
        response = self.client.delete(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'cancel_vote/'
        )
        self.assertEqual(Vote.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_add_choice_returns_403_to_anon_request(self):
        response = self.client.post(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'add_choice/',
            {'content': 'JavaScript'}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_add_choice_does_not_touch_data_after_anon_request(self):
        self.client.post(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'add_choice/',
            {'content': 'JavaScript'}
        )
        self.assertEqual(self.decision.choices.count(), 1)

    def test_add_choice_returns_403_to_foreign_request(self):
        self.client.force_authenticate(user=self.another_user)
        response = self.client.post(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'add_choice/',
            {'content': 'JavaScript'}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_add_choice_does_not_touch_data_after_foreign_request(self):
        self.client.force_authenticate(user=self.another_user)
        self.client.post(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'add_choice/',
            {'content': 'JavaScript'}
        )
        self.assertEqual(self.decision.choices.count(), 1)

    def test_add_choice_creates_instance(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'add_choice/',
            {'content': 'JavaScript'}
        )
        choice = self.decision.choices.last()
        self.assertEqual(self.decision.choices.count(), 2)
        self.assertEqual(choice.content, 'JavaScript')

    def test_add_choice_returns_400_when_invalid_data(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'add_choice/',
            {}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_choice_does_not_touch_data_after_invalid_data(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'add_choice/',
            {}
        )
        self.assertEqual(self.decision.choices.count(), 1)

    def test_remove_choice_returns_403_to_anon_user(self):
        response = self.client.delete(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'remove_choice/',
            {'id': self.decision.choices.first().id}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_choice_does_not_touch_data_after_anon_request(self):
        response = self.client.delete(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'remove_choice/',
            {'id': self.decision.choices.first().id}
        )
        self.assertEqual(self.decision.choices.count(), 1)

    def test_remove_choice_returns_403_to_foreign_user(self):
        self.client.force_authenticate(user=self.another_user)
        response = self.client.delete(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'remove_choice/',
            {'id': self.decision.choices.first().id}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_choice_does_not_touch_data_after_foreign_request(self):
        self.client.force_authenticate(user=self.another_user)
        response = self.client.delete(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'remove_choice/',
            {'id': self.decision.choices.first().id}
        )
        self.assertEqual(self.decision.choices.count(), 1)

    def test_remove_choice_removes_instance(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'remove_choice/',
            {'id': self.decision.choices.first().id}
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(self.decision.choices.count(), 0)

    def test_remove_choice_returns_400_when_invalid_data(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'remove_choice/',
            {}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_remove_choice_does_not_touch_data_when_invalid(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'remove_choice/',
            {}
        )
        self.assertEqual(self.decision.choices.count(), 1)

    # ==================================================== >>

    def test_update_choice_returns_403_to_anon_user(self):
        response = self.client.patch(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'update_choice/',
            {
                'id': self.decision.choices.first().id,
                'content': 'CoffeeScript'
            }
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_choice_does_not_touch_data_after_anon_request(self):
        response = self.client.patch(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'update_choice/',
            {
                'id': self.decision.choices.first().id,
                'content': 'CoffeeScript'
            }
        )
        self.assertEqual(self.decision.choices.count(), 1)

    def test_update_choice_returns_403_to_foreign_user(self):
        self.client.force_authenticate(user=self.another_user)
        response = self.client.patch(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'update_choice/',
            {
                'id': self.decision.choices.first().id,
                'content': 'CoffeeScript'
            }
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_choice_does_not_touch_data_after_foreign_request(self):
        self.client.force_authenticate(user=self.another_user)
        response = self.client.patch(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'update_choice/',
            {
                'id': self.decision.choices.first().id,
                'content': 'CoffeeScript'
            }
        )
        self.assertEqual(self.decision.choices.count(), 1)

    def test_update_choice_updates_instance(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'update_choice/',
            {
                'id': self.decision.choices.first().id,
                'content': 'CoffeeScript'
            }
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.decision.choices.first().content, 'CoffeeScript')

    def test_update_choice_returns_400_when_invalid_data(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'update_choice/',
            {}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_choice_does_not_touch_data_when_invalid(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            reverse('decisions_api:decisions-detail', args=(self.decision.id,))+'update_choice/',
            {}
        )
        self.assertEqual(self.decision.choices.count(), 1)


class VoteViewSetTest(APITestCase):

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
        self.decision = Decision.objects.create(
            heading='Programming langs',
            content='What programming language to choose',
            author=self.user
        )
        self.choice = Choice.objects.create(
            decision=self.decision,
            content='C++'
        )

    def test_returns_403_to_anon_user_get(self):
        response = self.client.get(reverse('decisions_api:votes-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_returns_403_on_anon_user_post(self):
        response = self.client.post(reverse('decisions_api:votes-list'), {
            'choice': self.choice.id
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_data_remains_untouched_after_anon_post(self):
        self.client.post(reverse('decisions_api:votes-list'), {
            'choice': self.choice.id
        })
        self.assertEqual(Vote.objects.count(), 0)

    def test_returns_403_on_own_decision_vote(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(reverse('decisions_api:votes-list'), {
            'choice': self.choice.id
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_data_remains_untouched_after_own_decision_vote(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(reverse('decisions_api:votes-list'), {
            'choice': self.choice.id
        })
        self.assertEqual(Vote.objects.count(), 0)

    def test_returns_only_own_data_on_get(self):
        self.client.force_authenticate(user=self.another_user)
        own_vote = Vote.objects.create(
            decision=self.decision,
            choice=self.choice,
            author=self.another_user
        )
        foreign_vote = Vote.objects.create(
            decision=self.decision,
            choice=self.choice,
            author=self.one_more_user
        )
        response = self.client.get(reverse('decisions_api:votes-list'))
        self.assertEqual(len(response.data), 1)

    def test_creates_instance_on_first_post(self):
        self.client.force_authenticate(user=self.another_user)
        response = self.client.post(reverse('decisions_api:votes-list'), {
            'choice': self.choice.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vote.objects.count(), 1)
        self.assertEqual(Vote.objects.first().choice, self.choice)

    def test_returns_403_on_more_than_one_vote_per_decision(self):
        self.client.force_authenticate(user=self.another_user)
        self.client.post(reverse('decisions_api:votes-list'), {
            'choice': self.choice.id
        })
        response = self.client.post(reverse('decisions_api:votes-list'), {
            'choice': self.choice.id
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_perform_create_sets_author_and_decision(self):
        self.client.force_authenticate(user=self.another_user)
        self.client.post(reverse('decisions_api:votes-list'), {
            'choice': self.choice.id
        })
        self.assertEqual(Vote.objects.first().author, self.another_user)
        self.assertEqual(Vote.objects.first().decision, self.decision)
