from django.http import HttpResponseRedirect
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render
from django.forms.models import model_to_dict
from django.core.urlresolvers import reverse_lazy
from django.views.generic import DetailView, View, ListView
from django.views.generic.base import RedirectView, TemplateView
from django.views.generic.edit import FormView
from rest_framework import viewsets, status
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from decisions.models import Decision
from decisions.serializers import DecisionSerializer
from .forms import CreateAccountForm, UpdateAccountForm
from .models import Account
from .serializers import AccountSerializer, ShortSerializer
from .permissions import IsAdminOrReadOnly, SafeMethodsOnly
from .tasks import send_login_email

# ===========================================
# ================= Mixins ==================
# ===========================================

class RedirectAnonUserMixin(object):

    def dispatch(self, *args, **kwargs):
        if not self.request.user.is_authenticated():
            return HttpResponseRedirect(reverse_lazy('account:login'))
        return super(RedirectAnonUserMixin, self).dispatch(*args, **kwargs)


class RedirectAuthedUserMixin(object):

    def dispatch(self, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated():
            return HttpResponseRedirect(reverse_lazy('account:profile'))
        return super(RedirectAuthedUserMixin, self).dispatch(*args, **kwargs)


class AccountsListMixin(object):
    model = Account
    template_name = 'account/people.html'
    context_object_name = 'accounts'

    def get_context_data(self, **kwargs):
        data = super(AccountsListMixin, self).get_context_data(**kwargs)
        data['title'] = self.title
        data['heading'] = self.heading
        data['if_empty_text'] = self.if_empty_text
        return data


# ===========================================
# ================== Views ==================
# ===========================================

class DefaultRedirectView(RedirectView):
    permanent = False

    def get_redirect_url(self, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated():
            return reverse_lazy('account:profile')
        else:
            return reverse_lazy('account:login')


class ProfileView(RedirectAnonUserMixin, TemplateView):
    template_name = 'profile.html'


class CreateAccountView(RedirectAuthedUserMixin, FormView):
    form_class = CreateAccountForm
    template_name = 'account/create_account.html'

    def get_success_url(self):
        return reverse_lazy('account:profile')

    def get_form_kwargs(self):
        kwargs = super(CreateAccountView, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def form_valid(self, form):
        form.clean_password2()
        form.save()
        form.login_user()
        return super(CreateAccountView, self).form_valid(form)


class UpdateAccountView(RedirectAnonUserMixin, FormView):
    form_class = UpdateAccountForm
    template_name = 'account/update_account.html'

    def get_form_kwargs(self):
        kwargs = super(UpdateAccountView, self).get_form_kwargs()
        kwargs['instance'] = self.request.user
        return kwargs

    def get_success_url(self):
        return reverse_lazy('account:profile')

    def form_valid(self, form):
        form.save()
        return super(UpdateAccountView, self).form_valid(form)


class LoginView(RedirectAuthedUserMixin, FormView):
    form_class = AuthenticationForm
    template_name = 'account/login.html'

    def get_success_url(self):
        return reverse_lazy('account:profile')

    def form_valid(self, form):
        user = form.get_user()
        form.confirm_login_allowed(user)
        login(self.request, user)
        send_login_email.delay(self.request.user.id)
        return super(LoginView, self).form_valid(form)


class LogoutView(RedirectView):
    permanent = False

    def get_redirect_url(self, *args, **kwargs):
        logout(self.request)
        return reverse_lazy('account:login')


class ForeignProfileView(RedirectAnonUserMixin, DetailView):
    model = Account
    template_name = 'foreign_profile.html'
    context_object_name = 'account'


class PeopleView(RedirectAnonUserMixin, AccountsListMixin, ListView):
    title = 'Profiles'
    heading = 'Check out some of our member profiles..'
    if_empty_text = 'No accounts to show :('

    def get_queryset(self):
        return Account.objects.exclude(pk=self.request.user.id).select_related()


class FollowersListView(RedirectAnonUserMixin, AccountsListMixin, ListView):
    title = 'Followers'
    heading = 'This is the list of your followers'
    if_empty_text = 'You are not followed by anybody yet :('

    def get_queryset(self):
        return self.request.user.followers.all()


class FollowingListView(RedirectAnonUserMixin, AccountsListMixin, ListView):
    title = 'Following'
    heading = 'his is the list of the people whom you are following'
    if_empty_text = 'You are not following anybody yet :('

    def get_queryset(self):
        return self.request.user.following.all()


# ===========================================
# ================ API Views ================
# ===========================================

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = (IsAdminOrReadOnly, SafeMethodsOnly,)

    def get_queryset(self):
        return Account.objects.exclude(pk=self.request.user.id)

    @list_route(methods=['get'])
    def following(self, request):
        accounts = self.request.user.following.all()
        serializer = ShortSerializer(accounts, many=True)
        return Response(serializer.data)

    @detail_route(methods=['get'])
    def follow(self, request, pk=None):
        try:
            account = Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            content = {'error': 'No such account'}
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        else:
            self.request.user.follow(account)
            serializer = ShortSerializer(account)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    @detail_route(methods=['get'])
    def stop_following(self, request, pk=None):
        try:
            account = Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            content = {'error': 'No such account'}
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        else:
            self.request.user.stop_following(account)
            return Response(status=status.HTTP_204_NO_CONTENT)

    @detail_route(methods=['get'])
    def decisions(self, request, pk=None):
        try:
            account = Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            content = {'error': 'No such account'}
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        else:
            decisions_list = Decision.objects.filter(author=account)
            serializer = DecisionSerializer(
                decisions_list,
                many=True,
                context={'request': self.request}
            )
            return Response(serializer.data)
