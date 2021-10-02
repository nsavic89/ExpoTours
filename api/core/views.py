from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response 
from rest_framework import status
from .models import Event, Traveller, EventImg
from .serializers import EventSerializer, TravellerSerializer, EventImgSerializer
import stripe


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
            return Response(ser.data, status.HTTP_201_CREATED)
        else:
            return Response('Error', status=status.HTTP_400_BAD_REQUEST)

class EventImgViewSet(viewsets.ModelViewSet):
    queryset = EventImg.objects.all()
    serializer_class = EventImgSerializer
