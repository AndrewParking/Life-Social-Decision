from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from . import views

urlpatterns = []

# API routing

router = DefaultRouter()
router.register(r'decisions', views.DecisionViewSet, base_name='decisions')
router.register(r'votes', views.VoteViewSet, base_name='votes')

urlpatterns += router.urls
