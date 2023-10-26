from django.urls import path
from .views import RecordGetAll, RecordGetById
from Tables.views import RecordAdd, RecordDeleteById, RecordDeleteAll

urlpatterns = [
    # 尾部带/
    path('record/', RecordGetAll.as_view(), name='record-get-all'),
    path('record/<int:pk>/', RecordGetById.as_view(), name='record-get-by-id'),
    path('record/add/', RecordAdd, name='record-add'),
    path('record/delete/<int:record_id>/', RecordDeleteById, name='record-delete-by-id'),
    path('record/delete/all/', RecordDeleteAll, name='record-delete-all')
]