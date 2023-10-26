<template>
    <div v-if="showRouteFromView" class="city-search-result">
        <!-- 搜索成功展示的组件 -->
        <div v-if="resultCities.length != 0" class="success-header">
            <!-- 提示词 -->
            <h2 style="color: #196883;"> 仅需一步即可！ </h2>
            <p> 告诉我们你想去哪座城市！ </p>

            <!-- 搜索结果表格，用户选一个最终结果，获取准确信息后准备显示详细信息 -->
            <div class="table-container">
                <p> 搜索结果：{{ resultCities.length }}条 </p>

                <el-table :data="resultCities" class="table" :header-cell-style="{
                    'font-size': 'large',
                    'font-weight': 'lighter',
                    'color': '#ffffff',
                    'background-color': '#589BB8'
                }">
                    <el-table-column label="序号" align="center" width="100">
                        <template #default="scope">
                            <label class="row-index"> {{ scope.$index }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" align="center">
                        <template #default="scope">
                            <label class="row-name"> {{ scope.row.name }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="国家" align="center">
                        <template #default="scope">
                            <label class="row-country"> {{ scope.row.country }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="位置" align="center" width="420">
                        <template #default="scope">
                            <label class="row-path"> {{ scope.row.path }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="160">
                        <template #default="scope">
                            <router-link :to="'/city-input/city-detail/' + scope.row.name" #default="slot" custom>
                                <el-button @click="showCityDetail(scope.row.areacode); slot.navigate();" class="select-button"> 选择 </el-button>
                            </router-link>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        
        <!-- 搜索失败展示的组件 -->
        <div v-else class="failed-header">
            <h2 style="color: #592525"> 并没有与您键入的关键词匹配的结果... </h2>
            <img src="../assets/citiesNotFound.svg">

            <div style="height: 20px;"></div>

            <!-- 给了一个成功示例，点击直接显示北京的详细信息 -->
            <label> 请检查您的输入内容，并键入合适的城市名称，如 </label>
            <router-link to="/city-input/city-search-result/北京" #default="slot" custom>
                <a href="#" @click="showTestResult(); slot.navigate();"> beijing </a>
            </router-link>
        </div>
    </div>

    <!-- 路由匹配组件 -->
    <router-view></router-view>
</template>

<script>
import { ElMessage, ElTable, ElTableColumn } from 'element-plus';
import { getCitySearch } from '../axios/webAPI/citySearch.js';
import { addSearchRecord } from '../axios/backendAPI/searchRecord';
import qs from 'qs';

export default {
    data() {
        return {
            showRouteFromView: true,  //是否展示本组件（路由切换时，作为RouteFrom组件用）
            keyword: "default",       //搜索关键词
            chosenCityAreacode: 0,    //选中城市的地区编码
            resultCities: []          //搜索结果城市数组
        }
    },
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
        //展示详细信息前置操作：将城市基本信息传入
        showCityDetail: function(areacode) {
            const filteredResult = this.resultCities.filter(city => city.areacode == areacode)[0];  //筛选编号符合的城市
            localStorage.setItem("selectedCity", JSON.stringify(filteredResult));  //将该城市存入本地存储，便于其他组件取用
        },
        //展示示例城市信息前置操作：将关键词beijing存入本地存储
        showTestResult: function() {
            this.resultCities.push({
                "areacode": "101010100",
                "lon": 116.4033,
                "lat": 39.9238,
                "name": "Beijing",
                "country": "China",
                "path": "Beijing,Beijing,Beijing,China"
            });

            localStorage.setItem("keyword", "beijing");
        },
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
    },
    watch: {
        //监视路由，转到当前组件对应的路径时显示当前组件
        $route: function(to, from) {
            this.showRouteFromView = to.path.includes("/city-input/city-search-result");
        }
    },
    components: {
        "el-table": ElTable,
        "el-table-column": ElTableColumn
    }
}
</script>

<style scoped>
.city-search-result {
    padding-top: 150px;
    text-align: center;
}
.table-container {
    margin-left: 17.5%;
    background-color: #19688390;
    border: 10px solid #19688390;
    border-radius: 5px;
    width: 65%;
}
.table-container > p {
    text-align: center;
    margin: 0;
    padding-top: 20px;
    padding-bottom: 20px;
    height: 36px;
    font-size: x-large;
    font-weight: lighter;
    color: white;
    background-color: #196883;
}
.table {
    width: 100%;
    height: 450px;
}
:deep(.el-table td) {
    padding: 20px;
    background-color: #C6F8FF;
}
:deep(.el-table__row) {
    font-size: large;
}
:deep(.el-table td,.building-top .el-table th.is-leaf) {
    border-bottom: 5px solid #196883;
}
.select-button {
    width: 100%;
    height: 40px;
    border: 2px solid white;
    border-radius: 10px;
    background-color: #196883;
}
.select-button:hover {
    background-color: #2aba98;
    box-shadow: 0 1em 1em -1em #0e3d26;
}
:deep(.el-button) {
    color: white;
    font-size: large;
    font-weight: lighter;
}
.failed-header {
    margin-top: 5%;
}
</style>../axios/webAPI/citySearch.js