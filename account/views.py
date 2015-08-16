from django.shortcuts import render
from django.views.generic.edit import FormView
from .forms import CreateAccountForm
from .models import Account

# Create your views here.


class CreateAccountView(FormView):
    form_class = CreateAccountForm
    template_name = 'account/create_account.html'
    success_url = '/' # temporary solution. Then redirect to the profile page

    # here would be overriden dispatch method to redirect authed users to
    # their profile page

    def get_form_kwargs(self):
        kwargs = super(CreateAccountView, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def form_valid(self, form):
        form.clean_password2()
        form.save()
        form.login_user()
        return super(CreateAccountView, self).form_valid(form)
