from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EventViewSet,
    TravellerViewSet,
    EventImgViewSet,
    DemandViewSet,
    send_facture_devis,
    send_payment_invitation,
    token_verification,
    client_events,
    client_events_imgs,
    client_booking,
    client_demand,
    create_checkout_session,
    create_checkout_session2
)
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'travellers', TravellerViewSet)
router.register(r'imgs', EventImgViewSet)
router.register(r'demands', DemandViewSet)


# The API URLs are now determined automatically by the router.
urlpatterns = [
    # CLIENT SIDE
    path('client-events/', client_events),
    path('client-events-imgs/', client_events_imgs),
    path('client-booking/', client_booking),
    path('client-demand/', client_demand),
    path('payment/<int:pk>', create_checkout_session),
    path('payment2/<int:pk>', create_checkout_session2),

    # ADMIN SIDE
    path('', include(router.urls)),
    path('facture-devis/<int:pk>', send_facture_devis),
    path('send-payment-invitation/<int:pk>', send_payment_invitation),
    path('token-ver', token_verification)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)