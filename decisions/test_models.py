from django.test import TestCase
from django.db.utils import IntegrityError
from account.models import Account
from .models import Decision, Choice, Vote


class DecisionModelTest(TestCase):

    def setUp(self):
        self.user = Account.objects.create(
            email='pop1111@tut.by',
            phone='+375333172375',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )

    def test_creates_decision(self):
        decision = Decision.objects.create(
            heading='Programming langs',
            content='What programming language to choose',
            author=self.user
        )
        self.assertEqual(decision.heading, 'Programming langs')
        self.assertEqual(decision.content, 'What programming language to choose')
        self.assertEqual(decision.author, self.user)

    def test_creation_fails_without_author(self):
        self.assertRaises(
            IntegrityError,
            Decision.objects.create,
            heading='Programming langs',
            content='What programming language to choose'
        )

    def test_updates_decision(self):
        decision = Decision.objects.create(
            heading='Programming langs',
            content='What programming language to choose',
            author=self.user
        )
        decision.heading = 'a'
        decision.content = 'b'
        decision.save()
        self.assertEqual(decision.heading, 'a')
        self.assertEqual(decision.content, 'b')

    def test_str(self):
        decision = Decision.objects.create(
            heading='Programming langs',
            content='What programming language to choose',
            author=self.user
        )
        self.assertEqual(decision.__str__(), decision.heading)


class ChoiceModelTest(TestCase):

    def setUp(self):
        self.user = Account.objects.create(
            email='pop1111@tut.by',
            phone='+375333172375',
            first_name='Andrew',
            last_name='Popov',
            password='homm1994'
        )
        self.decision = Decision.objects.create(
            heading='Programming langs',
            content='What programming language to choose',
            author=self.user
        )

    def test_creates_choice_instance(self):
        choice = Choice.objects.create(
            decision=self.decision,
            content='C++'
        )
        self.assertEqual(choice.decision, self.decision)
        self.assertEqual(choice.content, 'C++')

    def test_creation_fails_without_decision(self):
        self.assertRaises(
            IntegrityError,
            Choice.objects.create,
            content='Python'
        )

    def test_updates_choice_instance(self):
        choice = Choice.objects.create(
            decision=self.decision,
            content='C++'
        )
        choice.content = 'Ruby'
        choice.save()
        self.assertEqual(choice.content, 'Ruby')

    def test_str(self):
        choice = Choice.objects.create(
            decision=self.decision,
            content='C++'
        )
        self.assertEqual(choice.__str__(), 'C++')

    def test_votes_count(self):
        choice = Choice.objects.create(
            decision=self.decision,
            content='C++'
        )
        Vote.objects.create(
            decision=self.decision,
            author=self.user,
            choice=choice
        )
        self.assertEqual(choice.votes_count, 1)


class VoteModelTest(TestCase):

    def setUp(self):
         self.user = Account.objects.create(
             email='pop1111@tut.by',
             phone='+375333172375',
             first_name='Andrew',
             last_name='Popov',
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

    def test_creates_vote_instance(self):
        vote = Vote.objects.create(
            decision=self.decision,
            author=self.user,
            choice=self.choice
        )
        self.assertEqual(vote.decision, self.decision)
        self.assertEqual(vote.author, self.user)
        self.assertEqual(vote.choice, self.choice)

    def test_creation_fails_without_decision(self):
        self.assertRaises(
            IntegrityError,
            Vote.objects.create,
            author=self.user,
            choice=self.choice
        )

    def test_creation_fails_without_author(self):
        self.assertRaises(
            IntegrityError,
            Vote.objects.create,
            decision=self.decision,
            choice=self.choice
        )

    def test_creation_fails_without_choice(self):
        self.assertRaises(
            IntegrityError,
            Vote.objects.create,
            decision=self.decision,
            author=self.user
        )

    def test_decision_and_author_are_unique_together(self):
        vote = Vote.objects.create(
            decision=self.decision,
            author=self.user,
            choice=self.choice
        )
        self.assertRaises(
            IntegrityError,
            Vote.objects.create,
            decision=self.decision,
            author=self.user,
            choice=self.choice
        )

    def test_str(self):
        vote = Vote.objects.create(
            decision=self.decision,
            author=self.user,
            choice=self.choice
        )
        self.assertEqual(
            vote.__str__(),
            '%s <-> %s' % (self.choice.content, self.user.short_display_name)
        )
