from django.db import models




class Event(models.Model):
    name = models.CharField(max_length=255)
    theme = models.CharField(max_length=50)
    start = models.CharField(max_length=50)
    end = models.CharField(max_length=50)
    date1 = models.CharField(max_length=50)
    date2 = models.CharField(max_length=50)
    price = models.IntegerField()
    route = models.TextField(blank=True)

class Traveller(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.CharField(max_length=150)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=25)
    pickup = models.CharField(max_length=50, blank=True)
    joined_persons = models.TextField(blank=True)
    event = models.ForeignKey(Event, null=True, on_delete=models.SET_NULL)
    total = models.IntegerField()
    status = models.CharField(max_length=10)

class EventImg(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    img = models.ImageField()