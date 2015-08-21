from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Create your models here.


class AccountManager(BaseUserManager):

    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValidationError('You have to provide valid email')
        if not kwargs.get('phone'):
            raise ValidationError('You have to provide valid phone')

        account = self.model(
            email=email,
            phone=kwargs['phone'],
            password=password
        )

        if kwargs.get('first_name'): account.first_name = kwargs['first_name']
        if kwargs.get('last_name'): account.last_name = kwargs['last_name']
        if kwargs.get('photo'): account.photo = kwargs['photo']
        if kwargs.get('tagline'): account.tagline = kwargs['tagline']
        if kwargs.get('about'): account.about = kwargs['about']
        if kwargs.get('vk_link'): account.vk_link = kwargs['vk_link']
        if kwargs.get('tw_link'): account.tw_link = kwargs['tw_link']
        if kwargs.get('fb_link'): account.fb_link = kwargs['fb_link']
        if kwargs.get('in_link'): account.in_link = kwargs['in_link']

        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, email, password=None, **kwargs):
        account = self.create_user(email, password, **kwargs)
        account.is_admin = True
        account.is_superuser = True
        account.save()
        return account


class Account(AbstractBaseUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=25, unique=True)
    photo = models.ImageField(upload_to='avatars', default='/static/images/anon.png')
    tagline = models.CharField(max_length=250, blank=True)
    about = models.TextField(blank=True)
    vk_link = models.CharField(max_length=100, blank=True)
    tw_link = models.CharField(max_length=100, blank=True)
    fb_link = models.CharField(max_length=100, blank=True)
    in_link = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone',]

    objects = AccountManager()

    def __str__(self):
        return self.email

    def get_full_name(self):
        return '{0} {1}'.format(self.first_name, self.last_name)

    def get_short_name(self):
        return self.first_name

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    def save(self, *args, **kwargs):
        if not kwargs.get('email') and not self.email:
            raise ValidationError('We need your email.')
        if not kwargs.get('phone') and not self.phone:
            raise ValidationError('We need your phone.')
        return super(Account, self).save(*args, **kwargs)

    @property
    def is_staff(self):
        return self.is_admin

    def follow(self, account):
        Followship.objects.create(
            follower=self,
            following=account
        )

    def stop_following(self, account):
        try:
            following_case = Followship.objects.get(
                follower=self,
                following=account
            )
        except Followship.DoesNotExist:
            return False
        else:
            following_case.delete()
            return True

class Followship(models.Model):
    follower = models.ForeignKey(Account, related_name='following')
    following = models.ForeignKey(Account, related_name='followers')
    followship_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '{0} follows {1} on {2}'.format(
            self.follower.email,
            self.following.email,
            self.followship_data
        )
