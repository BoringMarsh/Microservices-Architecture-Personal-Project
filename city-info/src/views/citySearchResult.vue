<template>
    <div v-if="showRouteFromView" class="city-search-result">
        <div v-if="resultCities.length != 0" class="success-header">
            <h2 style="color: #196883;"> 仅需一步即可！ </h2>
            <p> 告诉我们你想去哪座城市！ </p>

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
        
        <div v-else class="failed-header">
            <h2 style="color: #592525"> 并没有与您键入的关键词匹配的结果... </h2>
            <img src="../assets/citiesNotFound.svg">
            <div style="height: 20px;"></div>
            <label> 请检查您的输入内容，并键入合适的城市名称，如 </label>
            <a href="/city-search-result/北京" @click="showTestResult"> beijing </a>
        </div>
    </div>

    <router-view></router-view>
</template>

<script>
import { ElTable, ElTableColumn } from 'element-plus';
import { getCitySearch } from '../axios/citySearch.js';
import { addSearchRecord } from '../axios/backendAPI/searchRecord';
import qs from 'qs';
//import moment from 'moment';

export default {
    data() {
        return {
            showRouteFromView: true,
            keyword: "default",
            chosenCityAreacode: 0,
            //resultCities: []
            resultCities: [{"areacode":"101301301","lon":109.119254,"lat":21.473343,"name":"Beihai","country":"China","path":"Beihai,Beihai,Guangxi,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101010100","lon":116.4033,"lat":39.9238,"name":"Beijing","country":"China","path":"Beijing,Beijing,Beijing,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101050606","lon":126.508737,"lat":48.245437,"name":"beian","country":"China","path":"beian,Heihe,Heilongjiang,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101040800","lon":106.437868,"lat":29.82543,"name":"beibei","country":"China","path":"beibei,Chongqing,Chongqing,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101030600","lon":117.13482,"lat":39.225555,"name":"beichen District ","country":"China","path":"beichen District ,Tianjin,Tianjin,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101270406","lon":104.468069,"lat":31.615863,"name":"beichuan","country":"China","path":"beichuan,Mianyang,Sichuan,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101091106","lon":119.486286,"lat":39.825121,"name":"beidaihe","country":"China","path":"beidaihe,Qinhuangdao,Hebei,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101180207","lon":114.352646,"lat":36.10978,"name":"beiguan","country":"China","path":"beiguan,Anyang,Henan,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101250506","lon":113.032208,"lat":25.792628,"name":"beihu","country":"China","path":"beihu,Chenzhou,Hunan,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101110109","lon":108.946994,"lat":34.251061,"name":"beilin","country":"China","path":"beilin,Xian,Shaanxi,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101050511","lon":126.990665,"lat":46.634912,"name":"beilin","country":"China","path":"beilin,Suihua,Heilongjiang,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101300903","lon":110.348052,"lat":22.701648,"name":"beiliu","country":"China","path":"beiliu,Yulin,Guangxi,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101210410","lon":121.831303,"lat":29.90944,"name":"beilun","country":"China","path":"beilun,Ningbo,Zhejiang,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101340535","lon":120.1378511,"lat":23.28153327,"name":"beimen District","country":"China","path":"beimen District,Tainan Ctiy,Taiwan,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101071205","lon":120.766951,"lat":41.803286,"name":"Beipiao","country":"China","path":"Beipiao,Chaoyang,Liaoning,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101250913","lon":111.452315,"lat":27.245688,"name":"beita","country":"China","path":"beita,Shaoyang,Hunan,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101132101","lon":87.824932,"lat":47.353177,"name":"beitun","country":"China","path":"beitun,Beitun,Xinjiang,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101340414","lon":120.7466109,"lat":24.18730277,"name":"beitun District","country":"China","path":"beitun District,Taichung city,Taiwan,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101070706","lon":121.795962,"lat":41.598764,"name":"beizhen","country":"China","path":"beizhen,Jinzhou,Liaoning,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"},{"areacode":"101340101","lon":121.5282024,"lat":25.15136446,"name":"Bey Tow Area ","country":"China","path":"Bey Tow Area ,Taipei,Taiwan,China","timezone":"Asia/Shanghai","time_converter":"UTC+08"}]
        }
    },
    mounted() {
        this.keyword = localStorage.getItem("keyword");
        var that = this;

        // getCitySearch("/city", {
        //     location: this.keyword,
        //     items: 20,
        //     area: "global",
        //     language: "ENG",
        //     withTz: true,
        //     withPoi: true
        // }).then(res => {
        //     console.log(JSON.stringify(res));
        //     that.resultCities = res.areaList;
        // }, err => {
        //     console.log(err);
        // });
        this.addRecord();
    },
    methods: {
        showCityDetail: function(areacode) {
            const filteredResult = this.resultCities.filter(city => city.areacode == areacode)[0];
            localStorage.setItem("selectedCity", JSON.stringify(filteredResult));
        },
        showTestResult: function() {
            localStorage.setItem("keyword", "beijing");
        },
        addRecord: function() {
            // addSearchRecord("/record/add/", qs.stringify({  //需要使用qs包中的stringify函数将JSON转化为form-data格式，否则后端接收数据为空
            //     city_name: this.keyword,
            //     result_count: this.resultCities.length
            // })).then(res => {
            //     console.log(res);
            // }, err => {
            //     console.log(err);
            // });
        }
    },
    watch: {
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

}
</style>