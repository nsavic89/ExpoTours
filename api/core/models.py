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
    price_id = models.CharField(max_length=100, blank=True)

class EventImg(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    img = models.ImageField()

class Demand(models.Model):
    name = models.CharField(max_length=50)
    organization = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=150)
    post_code = models.IntegerField()
    city = models.CharField(max_length=50)
    email = models.CharField(max_length=100)
    phone = models.CharField(max_length=25)
    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)
    dt_start = models.CharField(max_length=50)
    dt_end = models.CharField(max_length=50)
    n_travellers = models.IntegerField()
    comment = models.TextField(blank=True)
    status = models.CharField(max_length=20, blank=True)