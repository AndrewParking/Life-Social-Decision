from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from . import views


urlpatterns = [
    url(r'^messages_list/$', views.MessagesView.as_view(), name='messages_list'),
]

router = DefaultRouter()
router.register(r'messages', views.MessagesViewSet, base_name='messages')
urlpatterns += router.urls
