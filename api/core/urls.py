from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, TravellerViewSet, EventImgViewSet
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'travellers', TravellerViewSet)
router.register(r'imgs', EventImgViewSet)



# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)