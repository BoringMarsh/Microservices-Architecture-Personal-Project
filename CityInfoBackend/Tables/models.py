from django.db import models

# Create your models here.
class record(models.Model):
    city_name = models.CharField(max_length=30)
    result_count = models.IntegerField()
    time = models.DateTimeField()