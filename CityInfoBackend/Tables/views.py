from rest_framework import generics
from .models import record
from .serializers import RecordSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.shortcuts import get_object_or_404

# 获取全部历史记录
class RecordGetAll(generics.ListCreateAPIView):
    queryset = record.objects.all()
    serializer_class = RecordSerializer

# 根据id获取历史记录
class RecordGetById(generics.RetrieveUpdateDestroyAPIView):
    queryset = record.objects.all()
    serializer_class = RecordSerializer
    
# 添加一条历史记录
@csrf_exempt
def RecordAdd(request):
    if request.method == 'POST':
        city_name = request.POST.get('city_name')
        result_count = request.POST.get('result_count')
        new_record = record(city_name=city_name, result_count=result_count)
        new_record.save()
        return JsonResponse({ 'message': 'Record added successfully' })
    else:
        return JsonResponse({ 'message': 'Invalid request method' })
    
# 删除一条历史记录
@csrf_exempt
def RecordDeleteById(request, record_id):
    if request.method == 'DELETE':
        try:
            del_record = get_object_or_404(record, pk=record_id)
            del_record.delete()
            return JsonResponse({ 'message': 'Record deleted successfully' })
        except record.DoesNotExist:
            return JsonResponse({ 'error': f'Record id = {record_id} not found' }, status=404)
    else:
        return JsonResponse({ 'message': 'Invalid request method' })
    
# 删除所有历史记录
@csrf_exempt
def RecordDeleteAll(request):
    if request.method == 'DELETE':
        records = record.objects.all()
        records.delete()
        return JsonResponse({ 'message': 'Record all deleted successfully' })
    else:
        return JsonResponse({ 'error': 'Invalid request method' })