from django.urls import path
from .views import RecordGetAll, RecordGetById
from Tables.views import RecordAdd

urlpatterns = [
    # 尾部带/
    path('record/', RecordGetAll.as_view(), name='record-list'),
    path('record/<int:pk>/', RecordGetById.as_view(), name='record-by-id'),
    path('record/add/', RecordAdd, name="record-add")
]