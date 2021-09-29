from django.shortcuts import render
from rest_framework import viewsets
from .models import Event, Traveller, EventImg
from .serializers import EventSerializer, TravellerSerializer, EventImgSerializer




class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class TravellerViewSet(viewsets.ModelViewSet):
    queryset = Traveller.objects.all()
    serializer_class = TravellerSerializer

class EventImgViewSet(viewsets.ModelViewSet):
    queryset = EventImg.objects.all()
    serializer_class = EventImgSerializer
