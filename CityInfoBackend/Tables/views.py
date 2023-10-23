from rest_framework import generics
from .models import record
from .serializers import RecordSerializer
from django.http import JsonResponse

# 获取全部历史记录
class RecordGetAll(generics.ListCreateAPIView):
    queryset = record.objects.all()
    serializer_class = RecordSerializer

# 根据id获取历史记录
class RecordGetById(generics.RetrieveUpdateDestroyAPIView):
    queryset = record.objects.all()
    serializer_class = RecordSerializer
    
# 添加一条历史记录
def RecordAdd(request):
    if request.method == 'POST':
        print("************************POSTING**********************")
        print(request.POST)
        city_name = request.POST.get('city_name')
        result_count = request.POST.get('result_count')
        time = request.POST.get('time')
        new_record = record(city_name=city_name, result_count=result_count, time=time)
        new_record.save()
        return JsonResponse({'message': 'Record added successfully'})
    else:
        return JsonResponse({'message': 'Invalid request method'})