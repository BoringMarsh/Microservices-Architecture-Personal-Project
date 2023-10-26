##安装必要的包
```sh
pip install django
pip install djangorestframework
pip install django-cors-headers
pip install pymysql
```

##创建django项目
```sh
django-admin startproject [project-name]
cd [project-name]
```

##在项目下创建app（简单情况下一个app操纵一张表）
```sh
django-admin startapp [app-name]
```

##在project/__init__.py中加上：
```py
import pymysql
pymysql.install_as_MySQLdb()
```

##在project/settings.py中修改：
```py
INSTALLED_APPS = [
	...
	"TestModel",       # django-admin startapp ...
    "rest_framework",  # pip install djangorestframework
	"corsheaders"      # pip install django-cors-headers
]

MIDDLEWARE = [
	...
	"corsheaders.middleware.CorsMiddleware"  # 添加corsheaders的配置
]

# 允许所有域进行跨域请求
CORS_ALLOW_ALL_ORIGINS = True

# 允许特定域进行跨域请求
# CORS_ALLOWED_ORIGINS = [
#     "https://example.com",
#     "https://another-domain.com",
#     "https://localhost",
#     "https://127.0.0.1",
#     "https://100.80.195.159"
# ]

DATABASES = {
    "default": {
        # 设置mysql数据库连接属性
        "ENGINE": "django.db.backends.mysql",
        "NAME": "数据库名",
        "HOST": "本地或其它ip",
        "PORT": 端口号,
        "USER": "用户名",
        "PASSWORD": "密码"
    }
}

TIME_ZONE = 'Asia/Shanghai'  # 设置时区，尽管数据库存储的是UTC时间，但为了支持多时区，只要满足取出数据时是当地时间就行

USE_TZ = True  # 使用django自带pytz库，负责时区转换
```

##把project/urls.py修改为：
```py
from django.urls import path, include

urlpatterns = [
    path('api路由(尾部带/)', include('app名称.urls'))
]
```

##将app.models.py改为：
```py
from django.db import models
from django.utils import timezone

# Create your models here.

class account(models.Model):
    name = models.CharField(max_length=20)
    register_time = models.DateTimeField(default=timezone.now)  # 时间字段加上这个可以自动加上当前时间（UTC）
```
一个model类对应一张表
    1.类名对应表名
    2.类字段表示表字段
    3.类字段初值表示数据类型(max_length限制长度)
    4.如果有关于时间的字段，要在括号内加上auto_now_add=True。否则会报关于时间的错误，相关请求不成功!!!

##将app.serializers.py设为：
```py
from .models import 表名
from rest_framework import serializers

# 将表数据与JSON互换的序列化器
# 每一项左边是字段名，右边是类型
class AccountSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=20)
    register_time = serializers.DateTimeField()
```

##在app/views.py中改为：
```py
from rest_framework import generics
from .models import account
from .serializers import AccountSerializer

class AccountGetAll(generics.ListCreateAPIView):
    queryset = account.objects.all()
    serializer_class = AccountSerializer

class AccountGetById(generics.RetrieveUpdateDestroyAPIView):
    queryset = account.objects.all()
    serializer_class = AccountSerializer
```

##在app/urls.py中定义api地址：
```py
from django.urls import path
from .views import AccountGetAll, AccountGetById

urlpatterns = [
    # 尾部带/
    path('account/', AccountGetAll.as_view(), name='yourmodel-list'),
    path('yourmodel/<int:pk>/', AccountGetById.as_view(), name='yourmodel-detail'),
]
```

##在命令行运行以下指令：
```sh
python manage.py migrate               # 创建表结构
python manage.py makemigrations app名  # 让 Django 知道我们在我们的模型有一些变更
python manage.py migrate app名         # 创建表结构
```
最后生成表：app名_类名。以上面为例，生成的表名为testmodel_account(里面除了指定的name字段，还自带一个id字段)

##启动后端服务器
```sh
python manage.py runserver  # 观察输出获取端口号等信息
```