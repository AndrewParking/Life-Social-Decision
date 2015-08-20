from django.http import HttpResponseRedirect
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render
from django.forms.models import model_to_dict
from django.core.urlresolvers import reverse_lazy
from django.views.generic import DetailView, View, ListView
from django.views.generic.base import RedirectView, TemplateView
from django.views.generic.edit import FormView
from rest_framework import viewsets
from .forms import CreateAccountForm, UpdateAccountForm
from .models import Account
from .serializers import AccountSerializer
from .permissions import IsAdminOrReadOnly, SafeMethodsOnly

# Create your views here.


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
        return super(LoginView, self).form_valid(form)


class LogoutView(RedirectView):
    permanent = False

    def get_redirect_url(self, *args, **kwargs):
        logout(self.request)
        return reverse_lazy('account:login')


class PeopleView(RedirectAnonUserMixin, TemplateView):
    template_name = 'account/people.html'


# ===========================================
# ================ API Views ================
# ===========================================

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = (IsAdminOrReadOnly, SafeMethodsOnly,)

    def get_queryset(self):
        return Account.objects.exclude(pk=self.request.user.id)
