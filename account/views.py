from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.core.urlresolvers import reverse_lazy
from django.views.generic import DetailView
from django.views.generic.base import RedirectView
from django.views.generic.edit import FormView
from .forms import CreateAccountForm
from .models import Account

# Create your views here.


class DefaultRedirectView(RedirectView):
    permanent = False

    def get_redirect_url(self, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated():
            return reverse_lazy('account:profile', args=(user.id,))
        else:
            return reverse_lazy('account:create_account')


class ProfileView(DetailView):
    model = Account
    template_name = 'profile.html'
    context_object_name = 'account'

    def dispatch(self, *args, **kwargs):
        if not self.request.user.is_authenticated():
            return HttpResponseRedirect(reverse_lazy('account:create_account'))
        return super(ProfileView, self).dispatch(*args, **kwargs)


class CreateAccountView(FormView):
    form_class = CreateAccountForm
    template_name = 'account/create_account.html'

    # here would be overriden dispatch method to redirect authed users to
    # their profile pagel

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
