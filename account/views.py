from django.http import HttpResponseRedirect
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render
from django.forms.models import model_to_dict
from django.core.urlresolvers import reverse_lazy
from django.views.generic import DetailView, View
from django.views.generic.base import RedirectView
from django.views.generic.edit import FormView
from .forms import CreateAccountForm, UpdateAccountForm
from .models import Account

# Create your views here.


# ===========================================
# ================= Mixins ==================
# ===========================================

class RedirectAnonUserMixin(object):

    def dispatch(self, *args, **kwargs):
        if not self.request.user.is_authenticated():
            return HttpResponseRedirect(reverse_lazy('account:create_account'))
        return super(RedirectAnonUserMixin, self).dispatch(*args, **kwargs)


class RedirectAuthedUserMixin(object):

    def dispatch(self, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated():
            return HttpResponseRedirect(reverse_lazy('account:profile', args=(user.id,)))
        return super(RedirectAuthedUserMixin, self).dispatch(*args, **kwargs)


# ===========================================
# ================== Views ==================
# ===========================================

class DefaultRedirectView(RedirectView):
    permanent = False

    def get_redirect_url(self, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated():
            return reverse_lazy('account:profile', args=(user.id,))
        else:
            return reverse_lazy('account:create_account')


class ProfileView(RedirectAnonUserMixin, DetailView):
    model = Account
    template_name = 'profile.html'
    context_object_name = 'account'


class CreateAccountView(RedirectAuthedUserMixin, FormView):
    form_class = CreateAccountForm
    template_name = 'account/create_account.html'

    def get_success_url(self):
        return reverse_lazy('account:profile', args=(self.request.user.id,))

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
        return reverse_lazy('account:profile', args=(self.request.user.id,))

    def form_valid(self, form):
        form.save()
        return super(UpdateAccountView, self).form_valid(form)


class LoginView(RedirectAuthedUserMixin, FormView):
    form_class = AuthenticationForm
    template_name = 'account/login.html'

    def get_success_url(self):
        return reverse_lazy('account:profile', args=(self.request.user.id,))

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
