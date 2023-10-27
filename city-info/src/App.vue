<template>
    <div class="container">
        <!-- 第1层：背景元素 -->
        <div class="background">
            <!-- 白天的顶部背景 -->
            <div v-if="(options.theme.ifAutoSet && currentHour >= 6 && currentHour < 18) || (!options.theme.ifAutoSet && options.theme.value == 'day')"
                class="background-day-top"
            >
                <!-- 云朵 -->
                <img
                    v-for="num in 16"
                    src="./assets/background/cloud.svg"
                    class="background-day"
                    :style="
                        'left: ' + (dayStartLeft + (num - 1) * 6).toString() + '%;' +
                        'top: ' + (dayLevel + ((num - 1) % 2 == 0 ? -1 : 1) * dayDeviation).toString() + '%;' +
                        'opacity: ' + (num == 3 || cloudToWindIndexes.includes(num) ? '0%;' : '50%;')
                    "
                >
                <!-- 风 -->
                <img
                    v-for="num in 16"
                    src="./assets/background/wind.svg"
                    class="background-day"
                    :style="
                        'left: ' + (dayStartLeft + (num - 1) * 6).toString() + '%;' +
                        'top: ' + (dayLevel + ((num - 1) % 2 == 0 ? -1 : 1) * dayDeviation).toString() + '%;' +
                        'opacity: ' + (num == 3 || !cloudToWindIndexes.includes(num) ? '0%;' : '50%;')
                    "
                >
                <!-- 太阳 -->
                <img src="./assets/background/sun.svg" class="background-sun">
            </div>

            <!-- 晚上的顶部背景 -->
            <div v-else class="background-night-top">
                <!-- 星星 -->
                <img
                    v-for="num in 16"
                    src="./assets/background/star.svg"
                    class="background-night"
                    :style="
                        'left: ' + (nightStartLeft + (num - 1) * 6).toString() + '%;' +
                        'top: ' + (nightLevel + ((num - 1) % 2 == 0 ? -1 : 1) * nightDeviation).toString() + '%;' +
                        'opacity: ' + (num == 5 || starToCloudIndexes.includes(num) ? '0%' : '100%;')
                    "
                >
                <!-- 云朵 -->
                <img
                    v-for="num in 16"
                    src="./assets/background/cloud.svg"
                    class="background-night"
                    :style="
                        'left: ' + (nightStartLeft + (num - 1) * 6).toString() + '%;' +
                        'top: ' + (nightLevel + ((num - 1) % 2 == 0 ? -1 : 1) * nightDeviation).toString() + '%;' +
                        'opacity: ' + (num == 5 || !starToCloudIndexes.includes(num) ? '0%' : '50%;')
                    "
                >
                <!-- 月亮 -->
                <img src="./assets/background/moon.svg" class="background-moon">
            </div>
            
            <!-- 城市 -->
            <img
                v-for="num in 11"
                src="./assets/background/city.svg"
                class="background-city"
                :style="'left: ' + (cityStartLeft + (num - 1) * 8.6).toString() + '%;'"
            >
            <!-- 卫星 -->
            <img src="./assets/background/satellite.svg" class="background-satellite">
            <!-- 问号 -->
            <img src="./assets/background/questionMark.svg" class="background-question-mark">
            <!-- 双箭头 -->
            <img src="./assets/background/doubleArrow.svg" class="background-double-arrow">
            <!-- 雷达 -->
            <img src="./assets/background/radar.svg" class="background-radar">
            <!-- 单箭头 -->
            <img src="./assets/background/singleArrow.svg" class="background-single-arrow">
            <!-- 网络 -->
            <img src="./assets/background/network.svg" class="background-network">
            <!-- 放大镜 -->
            <img src="./assets/background/magnifier.svg" class="background-magnifier">
        </div>

        <!-- 第2层：路由匹配组件和对话框 -->
        <div class="content">
            <router-view></router-view>

            <!-- 历史对话框 -->
            <el-dialog v-model="ifShowHistoryDialog" title="历史" class="record-dialog">
                <div style="display: flex;">
                    <!-- 筛选历史记录的表单 -->
                    <el-form label-width="160px">
                        <el-form-item label="筛选方式">
                            <el-select v-model="selectRecords.method" class="record-select">
                                <el-option label="城市名（关键词）" value="城市名（关键词）"></el-option>
                                <el-option label="搜索时间" value="搜索时间"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="selectRecords.method == '城市名（关键词）'" label="城市名">
                            <el-input v-model="selectRecords.keyword" placeholder="请输入" class="record-input"></el-input>
                        </el-form-item>
                        <el-form-item v-else label="搜索时间">
                            <el-date-picker
                                v-model="selectRecords.keyword"
                                placeholder="请选择"
                                class="record-picker"
                                value-format="YYYY-MM-DD"
                            ></el-date-picker>
                        </el-form-item>
                    </el-form>

                    <el-button icon="delete" class="delete-all-button" @click="deleteAllSearchRecord"> 清除所有 </el-button>
                </div>

                <!-- 符合条件的历史记录表格 -->
                <div class="records-table-container">
                    <el-table :data="filteredRecords()" class="records-table" :header-cell-style="{
                        'font-size': 'large',
                        'font-weight': 'lighter',
                        'color': '#ffffff',
                        'background-color': '#589BB8'
                    }">
                        <el-table-column label="关键词" align="center">
                            <template #default="scope">
                                <label class="records-row-city_name"> {{ scope.row.city_name }} </label>
                            </template>
                        </el-table-column>
                        <el-table-column label="结果数" align="center">
                            <template #default="scope">
                                <label class="records-row-result_count"> {{ scope.row.result_count }} </label>
                            </template>
                        </el-table-column>
                        <el-table-column label="搜索时间" align="center">
                            <template #default="scope">
                                <label class="records-row-time"> {{ scope.row.time.slice(0, 10) + " " + scope.row.time.slice(11, 19) }} </label>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template #default="scope">
                                <el-button icon="delete" @click="deleteRecord(scope.row.id)" class="delete-button"> 删除 </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-dialog>

            <!-- 设置对话框 -->
            <el-dialog v-model="ifShowOptionsDialog" title="设置" style="width: 30%;">
                <el-form label-width="200px" style="margin-left: 10%;">
                    <el-form-item label="无痕浏览：">
                        <el-switch
                            v-model="options.ifRecordShutdown"
                            :active-value="true"
                            :inactive-value="false"
                            @click="updateRecordShutdown"
                        ></el-switch>
                    </el-form-item>
                    <el-form-item label="主题自动设置：">
                        <el-switch
                            v-model="options.theme.ifAutoSet"
                            :active-value="true"
                            :inactive-value="false"
                            @click="updateThemeValue"
                        ></el-switch>
                    </el-form-item>
                    <el-form-item v-if="!options.theme.ifAutoSet" label="主题：">
                        <el-switch
                            v-model="options.theme.value"
                            :active-value="'day'"
                            active-text="白天"
                            :inactive-value="'night'"
                            inactive-text="黑夜"
                        ></el-switch>
                    </el-form-item>
                </el-form>
            </el-dialog>

            <!-- 关于对话框 -->
            <el-dialog v-model="ifShowInfoDialog" title="关于" class="info-dialog">
                <p> 本应用为同济大学软件学院微服务架构课程个人项目 </p>
                <p> 选题为二选一：城市信息研究 </p>
                <p>
                    <label style="color: #196883; font-weight: 600;"> 前端：</label>
                    Vue开发，nginx部署
                </p>
                <div class="frontend-images">
                    <img src="./assets/devtools/vue.png">
                    <img src="./assets/devtools/nginx.png">
                </div>
                <p>
                    <label style="color: #196883; font-weight: 600;"> 后端： </label>
                    Ubuntu虚拟机上MySQL数据库，Python开发，django构建API，nginx+uwsgi部署
                </p>
                <div class="backend-images">
                    <img src="./assets/devtools/ubuntu.png">
                    <img src="./assets/devtools/mysql.png">
                    <br>
                    <img src="./assets/devtools/django.png">
                    <img src="./assets/devtools/uwsgi+nginx.png">
                </div>
                <p>
                    <label style="color: #196883; font-weight: 600;"> Web API： </label>
                    Gaode，APISpace，Rapid API
                </p>
                <div class="web-api-images">
                    <img src="./assets/devtools/gaode.png">
                    <img src="./assets/devtools/apispace.png">
                    <img src="./assets/devtools/rapidapi.png">
                </div>
                <p> 作者：2151294马威 </p>
                <p> 2151294@tongji.edu.cn </p>
            </el-dialog>
        </div>

        <!-- 第3层：工具栏 -->
        <div :style="getToolBarStyle()" class="tool-bar">
            <!-- 各菜单项按钮，一直显示 -->
            <img
                v-for="(value, key, index) in toolBarImages"
                :src="require('./assets/toolbar/' + key + '.svg')"
                :title="key"
                :style="getToolBarImgsStyle(index)"
                @click="toolbarFunction(key)"
            >
            
            <!-- 顶部当前城市信息，只有进入详细信息页面时显示 -->
            <span v-if="ifCurrentCityNameShow" class="city-name"> 当前城市：{{ currentCityName }} </span>
            <!-- 顶部导航按钮，只有进入详细信息页面时显示 -->
            <detail-index-button
                v-if="ifCurrentCityNameShow"
                :src="require('./assets/toolbar/indexes/index.svg')"
                :detail-name="'导航栏'"
                class="index-button"
                @mouseenter="ifMouseInIndexButton = true;"
                @mouseleave="ifMouseInIndexButton = false;"
            ></detail-index-button>
            <!-- 导航栏，只有进入详细信息页面，且鼠标悬停在导航栏区域时显示 -->
            <div
                v-show="ifMouseInIndexButton || ifMouseInIndexList"
                @mouseenter="ifMouseInIndexList = true;"
                @mouseleave="ifMouseInIndexList = false;"
                class="detail-indexes"
            >
                <detail-index-button
                    v-for="(item, index) in indexes"
                    @mouseenter="item.hover = true;"
                    @mouseleave="item.hover = false;"
                    :src="require('./assets/toolbar/indexes/' + item.engName + '.svg')"
                    :detail-name="item.name"
                    :style="getIndexButtonStyle(index, item.color, item.themeColor)"
                    @click="scrollToContainers(item.engName)"
                ></detail-index-button>
            </div>
        </div>
    </div>
    
</template>

<script>
import detailIndexButton from './components/detailIndexButton.vue';
import { getSearchRecord, deleteSearchRecord } from './axios/backendAPI/searchRecord';
import { ElDialog, ElTable, ElTableColumn, ElForm, ElFormItem, ElSwitch, ElSelect, ElOption, ElInput, ElDatePicker, ElButton, ElMessage } from 'element-plus';

export default {
    data() {
        return {
            currentHour: -1,         //当前小时

            dayStartLeft: 3,         //白天顶部背景：左侧起始位置
            dayLevel: 8,             //白天顶部背景：中心轴位置
            dayDeviation: 1.5,       //白天顶部背景：元素浮动幅度
            cloudToWindCount: 5,     //白天顶部背景：风个数
            cloudToWindIndexes: [],  //白天顶部背景：更改为风对应图标的下标数组
            nightStartLeft: 2.5,     //黑夜顶部背景：左侧起始位置
            nightLevel: 8,           //黑夜顶部背景：中心轴位置
            nightDeviation: 1.5,     //黑夜顶部背景：元素浮动幅度
            starToCloudCount: 8,     //黑夜顶部背景：云朵个数
            starToCloudIndexes: [],  //黑夜顶部背景：更改为云朵对应图标的下标数组
            cityStartLeft: 0,        //底部城市背景：左侧起始位置

            ifToolBarBackgroundShow: false,  //工具栏背景是否显示
            ifMouseInIndexButton: false,     //鼠标是否在导航键上
            ifMouseInIndexList: false,       //鼠标是否在导航栏内
            currentCityName: "",             //当前城市名
            ifCurrentCityNameShow: false,    //当前城市名是否显示

            //工具栏各按钮的名称
            toolBarImages: {
                "info": "关于",
                "options": "设置",
                "history": "历史",
                "home": "主页"
            },
            
            //导航栏各按钮的相关信息
            indexes: [
                { name: "详细位置", engName: "position", color: "black", themeColor: "#F9F871", hover: false },
                { name: "城市地图", engName: "map", color: "white", themeColor: "#196883", hover: false },
                { name: "地区信息", engName: "info", color: "white", themeColor: "#324157", hover: false },
                { name: "城市空气", engName: "air", color: "white", themeColor: "#007060", hover: false },
                { name: "城市天气", engName: "weather", color: "white", themeColor: "#E1A0C2", hover: false },
                { name: "机场", engName: "airport", color: "white", themeColor: "#386E97", hover: false },
                { name: "相关网页", engName: "webs", color: "white", themeColor: "#8251c6", hover: false },
                { name: "物价信息", engName: "prices", color: "white", themeColor: "#db57db", hover: false }
            ],

            ifShowHistoryDialog: false,  //历史对话框是否显示
            ifShowOptionsDialog: false,  //设置对话框是否显示
            ifShowInfoDialog: false,     //信息对话框是否显示
            searchRecords: [],           //搜索历史记录
            selectRecords: {             //筛选历史记录
                method: "",  //方式
                keyword: ""  //关键词
            },

            //各个设置项
            options: {
                theme: {
                    ifAutoSet: true,  //主题：是否自动设置
                    value: ""         //主题：手动设置主题值
                },
                ifRecordShutdown: false  //无痕浏览：是否开启
            },
        }
    },
    mounted() {
        //生成随机数，在黑夜顶部背景中随机将几个星星换成云朵
        while (this.starToCloudIndexes.length < this.starToCloudCount) {
            const randNum = Math.floor(Math.random() * 16 + 1);

            if (!this.starToCloudIndexes.includes(randNum) && randNum != 5) {
                this.starToCloudIndexes.push(randNum);
            }
        }

        //生成随机数，在白天顶部背景中随机将几个云朵换成风
        while (this.cloudToWindIndexes.length < this.cloudToWindCount) {
            const randNum = Math.floor(Math.random() * 9 + 1);

            if (!this.cloudToWindIndexes.includes(randNum) && randNum != 3) {
                this.cloudToWindIndexes.push(randNum);
            }
        }
        
        this.currentHour = new Date().getHours();  //取当前小时数
        this.updateThemeValue();                   //根据小时数更新手动设置主题的值
        localStorage.setItem("indexes", JSON.stringify(this.indexes));  //把导航栏信息存入本地存储，以便其他组件取用
        localStorage.setItem("ifRecordShutdown", "F");                  //预先设置，避免没设置这个值就进入/city-search-result，getItem的时候拿不到值
    },
    methods: {
        //动态取工具栏样式
        getToolBarStyle: function() {
            return {
                position: "fixed",
                top: "0%",
                left: "0%",
                width: "100%",
                height: "7%",
                backgroundColor: this.ifToolBarBackgroundShow ? "rgb(219, 238, 255)" : "#00000000",
                zIndex: 3
            }
        },
        //动态取工具栏按钮样式
        getToolBarImgsStyle: function(index) {
            return {
                "right": (index * 4 + 2).toString() + "%"
            }
        },
        //动态取导航键样式
        getIndexButtonStyle: function(index, color, themeColor) {
            return {
                color: color,
                backgroundColor: this.indexes[index].hover ? themeColor + "90" : themeColor
            }
        },
        //滚动到某个信息的组件
        scrollToContainers: function(name) {
            const targetComponent = document.getElementById("result-" + name)
            targetComponent.scrollIntoView({
                behavior: "smooth"
            });
        },
        //删除一条历史记录
        deleteRecord: function(id) {
            var that = this;

            deleteSearchRecord("/record/delete/" + id.toString() + "/").then(res => {
                ElMessage.success("删除成功！");
                console.log(res);
                that.searchRecords = that.searchRecords.filter(record => record.id != id);
            }, err => {
                console.log(err);
            });
        },
        //点击主页键的操作
        toolbarOperationHome: function() {
            this.ifShowHistoryDialog = false;
            this.ifShowOptionsDialog = false;
            this.ifShowInfoDialog = false;
            this.$router.push("/city-input");
        },
        //点击历史键的操作
        toolbarOperationHistory: function() {
            var that = this;

            getSearchRecord("/record/").then(res => {
                that.searchRecords = res;
                that.ifShowHistoryDialog = true;
            }, err => {
                ElMessage.error("历史获取失败，请检查服务器！");
                console.log(err);
            });
        },
        //点击设置键的操作
        toolbarOperationOptions: function() {
            this.ifShowOptionsDialog = true;
        },
        //点击关于键的操作
        toolbarOperationInfo: function() {
            this.ifShowInfoDialog = true;
        },
        //根据名字动态取函数
        toolbarFunction: function(key) {
            const funcName = 'toolbarOperation' + key.charAt(0).toUpperCase() + key.slice(1, key.length)
            this[funcName]();
        },
        //更新本地存储中是否开启无痕浏览的值
        updateRecordShutdown: function() {
            localStorage.setItem("ifRecordShutdown", this.options.ifRecordShutdown ? "T" : "F");
        },
        //根据小时数更新手动设置主题的值
        updateThemeValue: function() {
            this.options.theme.value = this.currentHour >= 6 && this.currentHour < 18 ? "day" : "night";
        },
        //返回筛选过的历史记录
        filteredRecords: function() {
            if (this.selectRecords.method == "城市名（关键词）") {
                return this.searchRecords.filter(record => record.city_name.includes(this.selectRecords.keyword));
            }
            else {
                return this.searchRecords.filter(record => record.time.includes(this.selectRecords.keyword));
            }
        },
        //删除所有历史记录
        deleteAllSearchRecord: function() {
            var that = this;
            const length = this.searchRecords.length;

            deleteSearchRecord("/record/delete/all/").then(res => {
                for (let i = 0; i < length; i++) {
                    that.searchRecords.shift();
                }
                ElMessage.success("清除成功！");
                console.log(res);
            }, err => {
                console.log(err);
            });
        }
    },
    watch: {
        $route: function(to, from) {
            //到详细信息页面再获取当前城市名，显示工具栏背景，显示当前城市名
            if (to.path.includes("/city-input/city-detail")) {
                this.currentCityName = JSON.parse(localStorage.getItem("selectedCity")).name;
            }

            this.ifToolBarBackgroundShow = (to.path.includes("/city-input/city-detail"));
            this.ifCurrentCityNameShow = (to.path.includes("/city-input/city-detail"));
        }
    },
    components: {
        "detail-index-button": detailIndexButton,
        "el-dialog": ElDialog,
        "el-table": ElTable,
        "el-table-column": ElTableColumn,
        "el-form": ElForm,
        "el-form-item": ElFormItem,
        "el-switch": ElSwitch,
        "el-select": ElSelect,
        "el-option": ElOption,
        "el-input": ElInput,
        "el-date-picker": ElDatePicker,
        "el-button": ElButton
    }
}

</script>

<style scoped>
.container {
    position: relative;
}
.content {
    position: relative;
    height: 100vh;
    overflow-y: auto;
    z-index: 2;
}
.background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    /* background-color: rgb(45, 66, 84); */
    background-color: rgb(219, 238, 255);
    top: 0%;
    left: 0%;
    z-index: 1;
}
.background-day {
    position: fixed;
    width: 4%;
    height: 6%;
}
.background-sun {
    position: fixed;
    opacity: 70%;
    width: 13.4%;
    height: 16.6%;
    top: 0%;
    left: 10%;
}
.background-night {
    position: fixed;
    width: 4%;
    height: 6%;
}
.background-moon {
    position: fixed;
    opacity: 70%;
    width: 13.4%;
    height: 16.6%;
    top: 0%;
    left: 23%;
}
.background-city {
    position: fixed;
    opacity: 30%;
    width: 13.4%;
    height: 16.6%;
    bottom: 5%;
}
.background-satellite {
    position: fixed;
    opacity: 50%;
    width: 16%;
    height: 18%;
    top: 25%;
    left: 5%;
}
.background-question-mark {
    position: fixed;
    opacity: 30%;
    width: 8%;
    height: 10%;
    top: 29%;
    right: 33%;
    transform: rotate(45deg);
}
.background-double-arrow {
    position: fixed;
    opacity: 30%;
    width: 30%;
    height: 30%;
    transform: rotate(-45deg);
    bottom: 25%;
    left: -2.2%;
}
.background-radar {
    position: fixed;
    opacity: 30%;
    width: 13%;
    height: 16%;
    bottom: 25%;
    right: 20%;
}
.background-single-arrow {
    position: fixed;
    opacity: 30%;
    width: 15%;
    height: 15%;
    bottom: 40%;
    right: 11%;
}
.background-network {
    position: fixed;
    opacity: 30%;
    width: 13%;
    height: 16%;
    bottom: 55%;
    right: 3%;
}
.background-magnifier {
    position: fixed;
    opacity: 30%;
    width: 13%;
    height: 16%;
    bottom: 35%;
    left: 25%;
}
.info-dialog p {
    text-align: center;
    font-size: 22px;
}
.frontend-images {
    display: flex;
    justify-content: center;
}
.frontend-images img {
    width: 20%;
}
.backend-images {
    display: flex;
}
.backend-images img {
    width: 25%;
}
.web-api-images {
    display: flex;
}
.web-api-images img {
    width: 33.3%;
}
.tool-bar > img {
    position: fixed;
    top: 0.8%;
    right: 2%;
    height: 4%;
    padding: 0.4%;
    border-radius: 10px;
    cursor: pointer;
}
.tool-bar > img:hover {
    background-color: #19688350;
}
.index-button:hover {
    background-color: #19688350;
}
.detail-indexes {
    display: flex;
    justify-content: center;
    padding-top: 1.2%;
    height: 100%;
    background-color: rgb(219, 238, 255);
}
.city-name {
    position: fixed;
    left: 45%;
    top: 1.7%;
    font-size: x-large;
    font-weight: normal;
}
:deep(.record-dialog.el-dialog) {
    width: 70%;
    margin-top: 50px;
    background-color: rgb(219, 238, 255);
    height: 850px;
}
:deep(.info-dialog.el-dialog) {
    margin-top: 20px;
    background-color: rgb(219, 238, 255);
}
:deep(.el-dialog) {
    background-color: rgb(219, 238, 255);
}
:deep(.el-dialog__title) {
    display: flex;
    justify-content: center;
    font-size: xx-large;
    margin-top: 20px;
    color: #196883;
}
:deep(.el-dialog__headerbtn) {
    font-size: 50px;
    top: 20px;
    right: 20px;
}
:deep(.el-dialog__headerbtn .el-dialog__close) {
    color: #196883;
}
:deep(.el-dialog__headerbtn .el-dialog__close:hover) {
    color: #00a78e;
}
.records-table-container {
    margin-left: 7%;
    margin-top: 20px;
    width: 86%;
    height: 520px;
}
.records-table {
    width: 100%;
    height: 100%;
}
:deep(.records-table-container .el-table td) {
    padding-top: 7px;
    font-size: larger;
    padding-bottom: 7px;
    background-color: white;
}
:deep(.records-table-container .el-table td,.building-top .el-table th.is-leaf) {
    border-bottom: 5px solid #dbeeff;
}
:deep(.el-form-item) {
    margin-top: 20px;
    margin-bottom: 20px;
}
:deep(.el-form-item__label) {
    font-size: x-large;
    color: #196883;
}
:deep(.el-switch) {
    --el-switch-on-color: #196883;
    --el-switch-off-color: #828992;
}
:deep(.el-switch__label--left span) {
    font-size: large;
}
:deep(.el-switch__label--right span) {
    font-size: large;
}
:deep(.el-switch__label--left.is-active) {
    font-weight: 600;
    color: #196883;
}
:deep(.el-switch__label--right.is-active) {
    font-weight: 600;
    color: #196883;
}
:deep(.record-dialog .el-input) {
    --el-input-border-color: rgb(212, 212, 212);
    --el-input-hover-border-color: #324157;
    --el-input-focus-border-color: #196883;
    --el-input-placeholder-color: #757575;
}
:deep(.record-dialog .el-input__wrapper) {
    border: 2px solid #324157;
    border-radius: 5px;
    background-color: rgb(255, 255, 255, 0.5);
    height: 30px;
    padding-left: 10px;
}
:deep(.record-dialog .el-input__wrapper.is-focus) {
    border: 2px solid #196883;
}
:deep(.record-dialog .el-input__inner) {
    font-size: large;
    color: #196883;
}
:deep(.record-dialog .el-form) {
    margin-left: 20%;
}
:deep(.record-dialog .el-form-item) {
    margin-top: 30px;
    margin-bottom: 30px;
}
:deep(.record-dialog .el-form-item__label) {
    font-size: x-large;
    color: #196883;
}
.record-select {
    width: 100%;
}
.record-input {
    width: 100%;
}
.record-picker {
    width: 50%;
}
.delete-all-button {
    margin-top: 20px;
    margin-left: 10%;
    width: 100px;
    height: 100px;
    border: 2px solid white;
    border-radius: 100px;
    background-color: #196883;
}
.delete-all-button:hover {
    background-color: #2aba98;
    box-shadow: 0 1em 1em -1em #0e3d26;
}
.delete-button {
    width: 100px;
    height: 40px;
    border: 2px solid white;
    border-radius: 5px;
    background-color: #196883;
}
.delete-button:hover {
    background-color: #2aba98;
    box-shadow: 0 1em 1em -1em #0e3d26;
}
:deep(.record-dialog .el-button) {
    color: white;
    font-size: medium;
    font-weight: lighter;
}
</style>
