# Application design and implementation

## 介绍
### 项目背景
在日常生活中，人们因为出于旅游、学习等目的，想要快速对一座城市有较为全面的了解。然而，由于相关数据分散在各个网站上，用户缺乏一个对城市信息高度聚合的应用，造成需要在各网站间来回切换，费时费力，还有可能因为信息过多而难辨真伪，得不到正确的信息。

### 项目主旨
针对城市信息查询效率低下、信息聚合度低的问题，本项目旨在开发一个基于混搭（mashup）架构的应用程序，通过整合多个Web APIs提供特定主题或领域的信息。该应用可以为用户提供来自不同供应商的城市信息，包括相关地理数据、天气空气质量、物价信息等。

### 项目目标
- 整合至少4个不同提供商的API，包括地图、天气预报、空气质量和相关网页信息等
- 提供用户友好的界面，让用户简单地通过输入城市名称就能查询到较为全面的城市信息
- 实现实时数据更新，例如保证API传回的不是过时的信息，或者通过后端实现历史记录功能
- 实现项目健壮性，城市名是固定的，需要将用户完全随机的输入内容引导到固定的城市名称上，让用户告诉应用自己真正想要的是哪座城市的信息

---

## 技术选择
为了实现城市信息查询应用，并解决城市信息查询的相关问题，满足用户的需求，我选用以下技术对项目进行实现。
### 前端技术
- **框架：Vue.js。** 其组件化开发，使代码更易于维护和重用。同时生态系统也很丰富，如处理路由的Vue Router等各种库与插件，可以帮助解决开发需求。
- **UI库：Element Plus。** 它与Vue.js高度集成，容易使用，也提供了丰富的组件库。其响应式设计也可以使应用适应不同尺寸的显示区域。
- **Ajax请求：Axios。** Axios提供了一个简单且易于理解的API，使开发者能够轻松地发送HTTP请求。使用的Promise支持使得可以用诸如.then方法异步处理成功与失败响应。拦截器机制易于开发者设置请求头，这对于需要安全访问（如设置token）的API来说尤为重要。

### 后端技术
- **后端框架：django。** 各种内置功能如URL路由、数据库模型等让开发变得高效，且强大的ORM让开发者直接用python语句进行数据库操作，不必拘泥于SQL语句的编写。其良好扩展性也可以让开发者自行添加中间件等。
- **数据库：MySQL。** 良好的兼容性使得MySQL可以：
  - 与许多编程语言或框架有良好集成：python、PHP、Java
  - 应用在各种操作系统上：Windows、Linux、macOS
它经过了长时间的发展和实践，在各种环境中被广泛使用，证明了其稳定性和可靠性，也易于上手。
- **API整合：Django REST framework。** 使用Django REST framework来构建RESTful API，以便前端能够与后端进行数据交互。

### 部署和托管
- **nginx：** 同时支持正反向代理，因此可以用于部署前端和后端项目。同时，其热部署可以在不中断服务情况下进行配置更新，方便调试。
- **uwsgi：** 其轻量级使得用python开发时只需pip install即可，且效率较高、消耗资源少、易于配置且较为稳定，配合nginx对django项目进行部署较为方便。
- **Ubuntu：** Ubuntu虚拟机上，计划配置MySQL数据库和进行django项目的开发，并在此部署后端。

---

## 具体实现：前端
### 界面总览
![](./pictures/1.overview1.png)
![](./pictures/2.overview2.png)
![](./pictures/3.overview3.png)
![](./pictures/4.overview4.png)
![](./pictures/5.overview5.png)
![](./pictures/6.overview6.png)
![](./pictures/7.overview7.png)

### 1.项目主体结构
#### 1.1 输入界面
<img src="./pictures/8.inputKeywordEmpty.png" width="60%">

用户使用时只需和输入框交互即可，关键词为空

<img src="./pictures/9.inputKeywordPassed.png" width="60%">

关键词不为空后按钮出现，点击查询

#### 1.2 查询结果页
![](./pictures/10.searchSuccess.png)

根据关键词搜索城市，结果以表格形式呈现，让用户确定要找的城市是哪一个，完成项目目标中对用户的随机输入进行引导，并最终显示正确数据。

![](./pictures/11.searchFailed.png)

如果返回结果为空，说明可能是用户输入非法。会有提示，且提供了一个示例的链接，点击后会出现上一幅图的搜索结果，里面有北京这1个结果。

#### 1.3 详细信息页
![](./pictures/12.detailPosition.png)

**详细位置：** 以行政区划形式显示城市位置

![](./pictures/13.detailMap.png)

**城市地图：** 用高德显示城市地图，支持缩放、比例尺、方向盘、鹰眼等组件

<img src="./pictures/14.detailInfo.png" width="60%">

**地区信息：** 显示所在地区信息，如当地时间（实时更新）、坐标、所属国家信息等

<img src="./pictures/15.detailAir.png" width="60%">

**城市空气：** 显示城市实时空气质量和排行

![](./pictures/16.detailWeatherDaily.png)
![](./pictures/17.detailWeatherHourly.png)

**城市天气：** 表格形式显示城市天气，有日预报和小时预报两种，可自由切换

<img src="./pictures/18.detailAirport.png" width="60%">

**机场：** 表格形式显示城市拥有的机场

![](./pictures/19.detailWebs.png)

**相关网页：** Google以城市名为关键词返回的相关网页，链接可跳转到相应网站

![](./pictures/20.detailPrices.png)

**物价信息：** 表格形式显示城市一些物价的最低价、均价、最高价

### 2.顶部工具栏：
![](./pictures/21.toolbarDefault.png)

一般情况下工具栏四个图标都在页面右上角，工具栏在非详细信息页时背景透明。点击各个按钮有对应对话框弹出。下面从左到右依次介绍

**主页：** 点击立即返回输入城市名称的页面，由于有搜索结果页，因此用浏览器自带回退要点击两次，而且会浪费一次城市搜索API的次数。因此直接返回更高效

![](./pictures/22.toolbarRecord.png)

**历史记录：** 点击时从后端取得历史记录并以表格形式显示，可以通过关键词或搜索时间进行筛选。也可以选择删除一条或清空所有记录。

<img src="./pictures/23.toolbarOptionsDefault.png" width="60%">

**设置：**
- 可在此设置无痕浏览和主题
- 主题主要改变顶部背景，白天模式是太阳、云朵和风，黑夜模式是月亮、星星和云朵
- 若自动设置打开，则读取当前时间，6-18点为白天模式，其余时间为黑夜模式
- 若自动设置关闭，则会显示手动设置按钮

![](./pictures/24.toolbarOptionsThemeDay.png)

手动设置白天模式

![](./pictures/25.toolbarOptionsThemeNight.png)

手动设置黑夜模式

<img src="./pictures/26.toolbarAbout.png" width="80%">

**关于：** 项目开发的一些简要信息

### 3.导航栏
![](./pictures/27.toolbarDetail.png)

隶属于顶部工具栏，只有在详细信息页种才显示（同时由于需要在本页面上下滚动，顶部工具栏背景不透明，且显示在各个信息栏的上层，总是停靠顶部）

![](./pictures/28.toolbarIndex.png)

鼠标悬停在导航栏键时，各个信息栏对应的按钮出现

![](./pictures/29.toolbarIndexNavigate.png)

点击即可自动滚动到对应的信息栏处

### Vue组件
第三方组件库Element Plus使用情况如下：
- **el-table：** 显示城市搜索结果、详细信息、历史记录
- **el-table-column：** 内嵌在各个**el-table**组件中
- **el-radio-group：** 天气信息栏在日预报和小时预报间切换
- **el-radio-button：** 内嵌在各个**el-radio-group**组件中
- **el-input：** 输入城市名、输入历史记录筛选关键词
- **el-button：** 搜索、选择城市、历史记录删除
- **el-dialog：** 顶部工具栏的后三个功能对应的对话框
- **el-form：** 筛选历史记录、设置
- **el-form-item：** 内嵌在各个**el-form**组件中
- **el-switch：** 设置
- **el-select：** 筛选历史记录
- **el-option：** 内嵌在各个**el-select**组件中
- **el-date-picker：** 筛选历史记录

### Axios请求
首先设置axios对象，配置好后将其get、put、post、delete方法export出去
```js
//cityAir.js
import axios from 'axios';

const cityAirInstance = axios.create({
    //各接口：
    //  空气质量实况：/aqi
    //  空气质量实时排行：/kqph
    //  空气质量昨日排行：/airranking
    //  过去24小时空气质量：/pastaqi
    //  逐小时空气质量预报：/airhourly
    //  逐日空气质量预报：/airforecast
    baseURL: "https://eolink.o.apispace.com/34324/air/v001",  //url
    timeout: 30000  //超时时长
});

// 用拦截器设置请求头
cityAirInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("cityAirToken");

        if (token) {
            config.headers["X-APISpace-Token"] = token;
            config.headers["Authorization-Type"] = "apikey";
        }
        
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

cityAirInstance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

//将get方法export出去，其余组件不需要再代码中进行请求配置，提高代码可维护性
export function getCityAir(url, params) {
    return cityAirInstance.get(url, {
        params: params
    });
}
```
在需详细信息页的组件中import方法，并在钩子函数mounted()内调用即可，详细信息页挂载时就会调用
```js
//cityDetail.vue的script标签内
import { getCityAir } from "../axios/webAPI/cityAir.js";

export default {
    //...

    mounted() {
        //...

        this.tickTime();      //开始按秒更新当地时间
        this.getCountry();    //调用接口，获取城市所属国家信息
        this.getInfo();       //调用接口，获取城市所属地区信息
        this.getAirport();    //调用接口，获取城市机场信息
        this.getWebs();       //调用接口，获取城市相关网页信息
        this.getPrices();     //调用接口，获取城市物价信息
        this.getWeather();    //调用接口，获取城市天气信息
        this.getAir();        //调用接口，获取城市空气信息
        this.initMap();       //加载城市高德地图
    },
    methods: {
        //...
        getAir: function() {
            var that = this;
            
            getCityAir("/aqi", {
                areacode: this.city.areacode  //城市编码
            }).then(res => {
                that.airRealTimeAqi = res.result.realtimeAqi;  //获取实时空气信息
                that.airRealTimePollutant = that.airRealTimeAqi.pollutant;  //获取实时污染物
                delete that.airRealTimeAqi["pollutant"];  //去除aqi对象中的pollutant属性
                delete that.airRealTimeAqi["data_time"];  //去除aqi对象中的data_time属性
                delete that.airRealTimeAqi["stations"];   //去除aqi对象中的stations属性
            }, err => {
                console.log(err);
            });
            
            getCityAir("/kqph", {
                areacode: this.city.areacode  //城市编码
            }).then(res => {
                const realtimeRanks = res.result.realtimeRanks;
                
                if (realtimeRanks.length > 0) {  //不稳定，若返回长度为0则不进一步取数据
                    that.airRealTimeRanks.aqi_ranking = realtimeRanks[0].hourlyRanking.aqi_ranking;
                    that.airRealTimeRanks.beat_rate = realtimeRanks[0].hourlyRanking.beat_rate;
                }
            }, err => {
                console.log(err);
            });
        },
    }
}
```
此外，在搜索结果页显示时，会将搜索历史通过POST请求存入数据库
```js
//citySearchResult.vue的script标签内
export default {
    //...

    mounted() {
        this.keyword = localStorage.getItem("keyword");  //获取搜索关键词
        var that = this;

        //调用接口，根据关键词搜索城市
        getCitySearch("/city", {
            location: this.keyword,  //城市名（关键词）
            items: 20,               //返回最大结果数
            area: "global",          //范围："china"或"global"
            language: "ENG",         //用英文返回
            withTz: true,            //返回时区信息
            withPoi: true            //返回经纬度信息
        }).then(res => {
            if (res["areaList"]) {  //取搜索结果（没有匹配结果时甚至没有areaList这个属性）
                that.resultCities = res.areaList;
            }
            else {
                that.resultCities = []
            }
            
            const ifRecordShutdown = localStorage.getItem("ifRecordShutdown");  //取无痕浏览设置信息
            if (ifRecordShutdown == "F")  //如果没开，添加搜索历史
                this.addRecord();
        }, err => {
            console.log(err);
        });
    },
    methods: {
        //...

        //调用接口，添加搜索记录
        addRecord: function() {
            addSearchRecord("/record/add/", qs.stringify({  //需要使用qs包中的stringify函数将JSON转化为form-data格式，否则后端接收数据为空
                city_name: this.keyword,  //城市名（关键词）
                result_count: this.resultCities.length  //搜索结果数
            })).then(res => {
                ElMessage.success("搜索成功！");
                console.log(res);
            }, err => {
                console.log(err);
            });
        }
    }
}
```

---

## 具体实现：后端
### 1.django REST API
序列化器实现数据转换
```py
# CityInfoBackend/Tables/serializers.py
from .models import record
from rest_framework import serializers

# 将表数据与JSON互换的序列化器
# 每一项左边是字段名，右边是类型
class RecordSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    city_name = serializers.CharField(max_length=30)
    result_count = serializers.IntegerField()
    time = serializers.DateTimeField()
```
GET请求
```py
# CityInfoBackend/Tables/views.py
from rest_framework import generics
from .models import record
from .serializers import RecordSerializer

# 获取全部历史记录
class RecordGetAll(generics.ListCreateAPIView):
    queryset = record.objects.all()  # 获得表中所有的记录
    serializer_class = RecordSerializer
```
POST请求
```py
# CityInfoBackend/Tables/views.py
from .models import record
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect

# 添加一条历史记录
@csrf_exempt  # 跨域请求
def RecordAdd(request):
    if request.method == 'POST':  # 判断请求类型
        city_name = request.POST.get('city_name')  # 从请求体里取数据
        result_count = request.POST.get('result_count')
        new_record = record(city_name=city_name, result_count=result_count)  # 生成新记录
        new_record.save()  # 将新记录插入数据库
        return JsonResponse({ 'message': 'Record added successfully' })
    else:
        return JsonResponse({ 'message': 'Invalid request method' })
```
DELETE请求
```py
# CityInfoBackend/Tables/views.py
from .models import record
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.shortcuts import get_object_or_404

# 删除一条历史记录
@csrf_exempt
def RecordDeleteById(request, record_id):
    if request.method == 'DELETE':  # 判断请求类型
        try:  # 尝试获取记录并删除，若记录不存在则报错
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
    if request.method == 'DELETE':  # 判断请求类型
        records = record.objects.all()  # 获得表中所有的记录，然后删除
        records.delete()
        return JsonResponse({ 'message': 'Record all deleted successfully' })
    else:
        return JsonResponse({ 'error': 'Invalid request method' })
```
设置url以确定接口地址
```py
# CityInfoBackend/Tables/urls.py
from django.urls import path
from .views import RecordGetAll
from Tables.views import RecordAdd, RecordDeleteById, RecordDeleteAll

urlpatterns = [
    # 尾部带/
    path('record/', RecordGetAll.as_view(), name='record-get-all'),
    path('record/add/', RecordAdd, name='record-add'),
    path('record/delete/<int:record_id>/', RecordDeleteById, name='record-delete-by-id'),
    path('record/delete/all/', RecordDeleteAll, name='record-delete-all')
]
```

### 2.Record表
通过上述url进行得请求就可以操作数据库中的record表，实现历史记录功能
![](./pictures/30.table.png)

---

## 开发中遇到的困难
### 1.API之间不兼容
**问题：** 数据提供商分国内和国外，有些API传入中文无搜索结果
**解决：** 中文支持的API返回结果可选为英文，统一用英文返回，处理后传给其余API回去数据
```json
//搜索城市的请求体
{
    "location": this.keyword,
    "items": 20,
    "area": "global",
    "language": "ENG",  //用英文返回
    "withTz": true,
    "withPoi": true
}
```

### 2.组件之间的传值
**问题：** 很多组件需要传值，却不一定是父子关系，无法用v-slot传值
**解决：** 用localStorage进行存取（从程序运行时就存在，也可以解决token刷新后失效的问题）
```js
//发送组件.vue中的script标签内
localStorage.setItem("valueName", value);

//接收组件.vue中的script标签内
const value = localStorage.getItem("valueName");
```

### 3.localStorage传JSON对象
**问题：** 用localStorage传JSON对象，取出来时报错
**解决：** localStorage只能以字符串形式存储，用JSON.parse()方法解决
```js
//接收组件.vue中的script标签内
const object = JSON.parse(localStorage.getItem("valueName"));
```

### 4.Axios无法请求后端
**问题：** 请求统一报403：Forbidden错误，无法访问后端
**解决：** 后端跨域访问设限，需要配置CORS中间件，同时设置CORS_ALLOW_ALL_ORIGINS为True

### 5.POST无法将数据传到后端
**问题：** 后端从请求体中取值报错，打印发现请求体为空
**解决：** 前端需要用qs将JSON转换为django能接受的类型
```js
import qs from 'qs';

addRecord(url, qs.stringify({
    key1: "value1",
    key2: "value2",
    ...
})).then(
    ...
);
```

---

## 项目总结

本项目在结合各种Web API的调用，以及前后端配置与连通，基本实现了一个城市信息查询的应用。通过项目的成功实施，我得出了以下结论：

### 成就

- 基本实现了一个全面的城市信息网站，至少包含了4个供应商的信息，用户可以方便地查询各种信息
- 操作简单、色彩明快，对用户友好
- 加入了多种辅助功能，如设置、浏览记录等，让网站的使用更方便
- 初步学习了一个极其简易的全栈开发知识，踩了许多的坑，也解决了不少问题，积累了经验

### 改进展望
- 前端技术有待精进，以期给用户更好的视觉体验，如添加动画、渐变色等组件效果
- 一些功能存在升级空间，如点击一条历史记录可再次根据对应的关键词搜索一次
- 后端可扩展空间较大，可以增加世界国家表，静态存储国家信息并定期更新
- 增加更多的城市信息数据源，寻找更为稳定、功能更全面的接口
- 进一步优化性能和安全性，以确保网站的可用性和用户数据的保护
- 真正将项目部署到服务器上（如阿里云ECS），真正实现一个网络应用
- 尝试进行移动端开发，完成移植

### 心得
本次项目是一次有意义的尝试，技术不精的我踩到的坑很多。但除了查询资料外，我也得到了包括室友在内许多同学的宝贵建议，让我感激不尽。
无论如何，通过技术为用户提供信息资源，这是十分有成就感的一件事。期待未来能像改进展望中提到的一样，继续改进和拓展这个项目，为更多的用户提供价值。

---

## Documents of the web APIs

1. 高德地图
> https://lbs.amap.com/api/javascript-api/guide/map/lifecycle

2. 城市物价
> https://rapidapi.com/traveltables/api/cost-of-living-and-prices

3. 相关网页
> https://rapidapi.com/herosAPI/api/google-search74

4. 国家信息
> https://rapidapi.com/alejandro.perez3469/api/rest-countries10

5. 机场查询
> https://rapidapi.com/karanp41-eRiF1pYLK1P/api/world-airports-directory

6. 人口、货币、所属国家
> https://rapidapi.com/wirefreethought/api/geodb-cities

7. 空气质量
> https://www.apispace.com/eolink/api/34324/apiDocument

8. 天气预报
> https://www.apispace.com/eolink/api/456456/apiDocument