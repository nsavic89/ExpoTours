from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets
from rest_framework.response import Response 
from rest_framework import status
from .models import Event, Traveller, EventImg, Demand, Galery, GaleryImg
from django.core.mail import send_mail
from .serializers import (
    EventSerializer,
    TravellerSerializer,
    EventImgSerializer,
    DemandSerializer,
    GalerySerializer,
    GaleryImgSerializer
)
from rest_framework.permissions import AllowAny
import stripe
from api.settings import EMAIL_HOST_USER




stripe.api_key = "sk_test_QB0BvKFCZfTP4BZAz4R5oyvv00WPPDqfTa"




# client side --------------------------------------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def client_galleries(request):
    items = Galery.objects.all()
    items_ser = GalerySerializer(items, many=True)
    return Response(items_ser.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def client_gimgs(request):
    items = GaleryImg.objects.all()
    items_ser = GaleryImgSerializer(items, many=True)
    return Response(items_ser.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def client_events(request):
    events = Event.objects.all()
    events_ser = EventSerializer(events, many=True)
    return Response(events_ser.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def client_events_imgs(request):
    events = EventImg.objects.all()
    events_ser = EventImgSerializer(events, many=True)
    return Response(events_ser.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def client_booking(request):
    ser = TravellerSerializer(data=request.data)
    if ser.is_valid() == True:
        trv = ser.save()
        price_amount = trv.total * 100
        event_name = trv.event.name

        price_obj = stripe.Price.create(
            unit_amount=price_amount,
            currency="chf",
            product_data={"name": event_name}
        )
        trv.price_id = price_obj.id
        trv.save()

        try:
            send_mail(
                'ExpoTours.ch - confirmation', 
                    """
                        Cher Monsieur, Chère Madame,
                        Ce message est reçu pour confirmer votre intérêt pour l'événement intitulé'{}'. 
                        Dans quelques jours, vous allez recevoir les instructions 
                        de paiement.
                        Nos meilleurs salutations!
                    """.format(trv.event.name),
                EMAIL_HOST_USER,
                [trv.email],
                fail_silently=False
            )
    
            # return success message
            return Response(ser.data, status.HTTP_201_CREATED)
        except:
            return Response('ERROR', status=status.HTTP_400_BAD_REQUEST)    
    return Response('Error', status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def client_demand(request):
    data_ser = DemandSerializer(data=request.data)
    if data_ser.is_valid() == True:
        data_ser.save()

        try:
            send_mail(
                'ExpoTours.ch - confirmation (demande)', 
                    """
                        Cher Monsieur, Chère Madame,
                        Ce message est reçu pour confirmer que nous avons reçu votre demande. 
                        Nous allons la traiter dans le meilleur délai.
                        Nos meilleurs salutations!
                    """,
                EMAIL_HOST_USER,
                [data_ser.data['email']],
                fail_silently=False
            )
    
            # return success message
            return Response('OK', status.HTTP_201_CREATED)
        except:
            return Response('ERROR', status=status.HTTP_400_BAD_REQUEST)   

        return Response('OK', status=status.HTTP_200_OK)

    return Response('Error', status=status.HTTP_400_BAD_REQUEST)




# admin pages ---------------------------------------------------------
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class TravellerViewSet(viewsets.ModelViewSet):
    queryset = Traveller.objects.all()
    serializer_class = TravellerSerializer

class EventImgViewSet(viewsets.ModelViewSet):
    queryset = EventImg.objects.all()
    serializer_class = EventImgSerializer

class DemandViewSet(viewsets.ModelViewSet):
    queryset = Demand.objects.all()
    serializer_class = DemandSerializer

class GaleryViewSet(viewsets.ModelViewSet):
    queryset = Galery.objects.all()
    serializer_class = GalerySerializer

class GaleryImgViewSet(viewsets.ModelViewSet):
    queryset = GaleryImg.objects.all()
    serializer_class = GaleryImgSerializer

@api_view(['POST'])
def send_facture_devis(request, pk):
    price_obj = stripe.Price.create(
        unit_amount=request.data['price']*100,
        currency="chf",
        product_data={"name": request.data['name']}
    )

    demand = Demand.objects.get(pk=pk)
    demand.price_id = price_obj.id
    demand.status = 'Facturé'
    demand.save()

    # send email with the payment link
    try:
        send_mail(
            'ExpoTours.ch - paiement pour {}'.format(request.data['name']), 
            'ExpoTours.ch vous invite à procéder au paiement de {}. Veuillez cliquer sur le lien: http://localhost:3000/payment2/{}'.format(request.data['name'], demand.id),
            EMAIL_HOST_USER,
            [demand.email],
            fail_silently=False
        )

    except:
        return Response('ERROR', status=status.HTTP_400_BAD_REQUEST)

    return Response('CREATED', status=status.HTTP_201_CREATED)


# send payment invitation to travellers
@api_view(['GET'])
def send_payment_invitation(request, pk):
    trvs = Traveller.objects.filter(event=pk)
    event = Event.objects.get(pk=pk)
    
    try:
        for t in trvs:
            send_mail(
                'ExpoTours.ch - paiement pour {}'.format(event.name), 
                'ExpoTours.ch vous invite à procéder au paiement de {} prévu pour {}. Veuillez cliquer sur le lien: http://localhost:3000/payment/{}'.format(event.name, event.date1, t.id),
                EMAIL_HOST_USER,
                [t.email],
                fail_silently=False
            )
            t.status='invited'
            t.save()
        
        # return success message
        return Response('OK', status=status.HTTP_200_OK)
    except:
        return Response('ERROR', status=status.HTTP_400_BAD_REQUEST)


# payment page

from django.shortcuts import redirect
YOUR_DOMAIN = 'http://localhost:3000'

@api_view(['POST'])
@permission_classes([AllowAny])
def create_checkout_session(request,pk):
    traveller = Traveller.objects.get(pk=pk)

    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    # Provide the exact Price ID (e.g. pr_1234) of the product you want to sell
                    'price': traveller.price_id,
                    'quantity': 1,
                },
            ],
            payment_method_types=[
              'card',
            ],
            mode='payment',
            success_url=YOUR_DOMAIN + '/success',
            cancel_url=YOUR_DOMAIN + '/warning',
        )
    except Exception as e:
        return str(e)

    return redirect(checkout_session.url, code=303)

# payment for demand from client -> not event organized by expotours
@api_view(['POST'])
@permission_classes([AllowAny])
def create_checkout_session2(request,pk):
    demand = Demand.objects.get(pk=pk)

    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    # Provide the exact Price ID (e.g. pr_1234) of the product you want to sell
                    'price': demand.price_id,
                    'quantity': 1,
                },
            ],
            payment_method_types=[
              'card',
            ],
            mode='payment',
            success_url=YOUR_DOMAIN + '/success',
            cancel_url=YOUR_DOMAIN + '/warning',
        )
    except Exception as e:
        return str(e)

    return redirect(checkout_session.url, code=303)



@api_view(['get'])
@permission_classes([AllowAny])
def token_verification(request):
    return Response(request.user.username, status=status.HTTP_200_OK)