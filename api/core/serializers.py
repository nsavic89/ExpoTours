from rest_framework import serializers
from .models import Event, Traveller, EventImg




class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class TravellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Traveller
        fields = '__all__'

class EventImgSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImg
        fields = '__all__'