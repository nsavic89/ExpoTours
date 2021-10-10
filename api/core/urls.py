from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, TravellerViewSet, EventImgViewSet, DemandViewSet, send_facture_devis
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'travellers', TravellerViewSet)
router.register(r'imgs', EventImgViewSet)
router.register(r'demands', DemandViewSet)


# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('facture-devis/<int:pk>', send_facture_devis)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)