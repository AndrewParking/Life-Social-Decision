from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from . import views


urlpatterns = []

router = DefaultRouter()
router.register(r'messages', views.MessagesViewSet, base_name='messages')
urlpatterns += router.urls
