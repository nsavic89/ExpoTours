from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response 
from rest_framework import status
from .models import Event, Traveller, EventImg, Demand
from django.core.mail import send_mail
from .serializers import (
    EventSerializer,
    TravellerSerializer,
    EventImgSerializer,
    DemandSerializer
)
import stripe
from api.settings import EMAIL_HOST_USER





stripe.api_key = "sk_test_QB0BvKFCZfTP4BZAz4R5oyvv00WPPDqfTa"



class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class TravellerViewSet(viewsets.ModelViewSet):
    queryset = Traveller.objects.all()
    serializer_class = TravellerSerializer

    # save new traveller
    # create price instance on stripe
    def create(self, request):
        ser = TravellerSerializer(data=request.data)
        if ser.is_valid():
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

                            Ce message est reçu pour confirmer votre intérêt pour {}. 
                            Dans les jours qui suivent, vous recevrez les instructions 
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

        else:
            return Response('Error', status=status.HTTP_400_BAD_REQUEST)

class EventImgViewSet(viewsets.ModelViewSet):
    queryset = EventImg.objects.all()
    serializer_class = EventImgSerializer

class DemandViewSet(viewsets.ModelViewSet):
    queryset = Demand.objects.all()
    serializer_class = DemandSerializer

@api_view(['POST'])
def send_facture_devis(request, pk):
    price_obj = stripe.Price.create(
        unit_amount=request.data['price']*100,
        currency="chf",
        product_data={"name": request.data['name']}
    )

    demand = Demand.objects.get(pk=pk)
    demand.status = 'Facturé'
    demand.save()

    # here should be email sent to the corresponing user

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
