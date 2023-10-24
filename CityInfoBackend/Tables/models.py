from django.db import models
from django.utils import timezone

# Create your models here.
class record(models.Model):
    city_name = models.CharField(max_length=30)
    result_count = models.IntegerField()
    time = models.DateTimeField(default=timezone.now)  # 调整时区信息，避免错误数据加入或报错（不要加括号！）