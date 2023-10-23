from .models import record
from rest_framework import serializers

# 将表数据与JSON互换的序列化器
# 每一项左边是字段名，右边是类型
class RecordSerializer(serializers.Serializer):
    city_name = serializers.CharField(max_length=30)
    result_count = serializers.IntegerField()
    time = serializers.DateTimeField()