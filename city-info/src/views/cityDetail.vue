<template>
    <div class="city-detail">
        <!-- 信息栏：详细位置 -->
        <div class="result-position-container" id="result-position">
            <p>
                <img src="../assets/toolbar/indexes/position.svg" style="width: 24px;">
                <label> 详细位置：From APISpace </label>
            </p>

            <div>
                <p> {{ city.path }} </p>
            </div>
        </div>
        
        <div class="flex-container">
            <!-- 信息栏：城市地图 -->
            <div class="result-map-container" id="result-map">
                <p>
                    <img src="../assets/toolbar/indexes/map.svg" style="width: 24px;">
                    <label> 城市地图：From Gaode </label>
                </p>

                <!-- 高德地图显示组件 -->
                <div id="gaode-map"></div>
            </div>

            <!-- 信息栏：地区信息 -->
            <div class="result-info-container" id="result-info">
                <p>
                    <img src="../assets/toolbar/indexes/info.svg" style="width: 24px;">
                    <label> 地区信息：From Rapid API & APISpace </label>
                </p>

                <div>
                    <ul>
                        <li> 当地时间：{{ currentLocalTime }} </li>
                        <li> 经纬度：{{ city.lon + ", " + city.lat }} </li>
                        <li> 人口：{{ city.population }} </li>
                        <li> 国家：{{ city.country }} </li>
                        <li> 货币：{{ country.currency.code + "(" + country.currency.symbol + ")" }} </li>
                        <li>
                            国旗：
                            <img
                                :src="country.flag"
                                @error="handleCountryFlagError"
                                alt="../assets/noPicture.svg"
                                class="result-info-country-flag"
                            >
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="flex-container">
            <!-- 信息栏：城市空气 -->
            <div class="result-air-container" id="result-air">
                <p>
                    <img src="../assets/toolbar/indexes/air.svg" style="width: 24px;">
                    <label> 城市空气：From APISpace </label>
                </p>
                
                <div class="result-air-aqi">
                    <p> 实时情况： </p>

                    <label v-for="(value, key) in airRealTimeAqi" :key="key" class="result-air-card">
                        <h4> {{ key }} </h4>
                        <hr>
                        <p> {{ value }} </p>
                    </label>
                </div>
                
                <div class="result-air-ranking">
                    <p> 实时排行： </p>
                    <label>
                        排名：
                        <label style="color: #007060;"> {{ airRealTimeRanks.aqi_ranking }} </label>
                    </label>
                    <br>
                    <label>
                        打败了
                        <label style="color: #007060;"> {{ airRealTimeRanks.beat_rate }} </label>
                        的城市
                    </label>
                </div>
            </div>

            <!-- 信息栏：城市天气 -->
            <div class="result-weather-container" id="result-weather">
                <!-- 信息栏顶部 -->
                <div class="result-weather-header">
                    <el-radio-group v-model="weatherDisplay" class="result-weather-radio">
                        <el-radio-button label="日预报"></el-radio-button>
                        <el-radio-button label="小时预报"></el-radio-button>
                    </el-radio-group>
                    <img src="../assets/toolbar/indexes/weather.svg" style="width: 24px;">
                    <label> 城市天气：From APISpace </label>
                </div>
                
                <!-- 小时预报表格（选择小时预报时显示） -->
                <el-table v-if="weatherDisplay == '小时预报'" :data="weatherHoursData" class="result-weather-hour-table" :header-cell-style="{
                    'font-size': 'large',
                    'font-weight': 'normal',
                    'color': '#212121',
                    'background-color': '#FFC288'
                }">
                    <el-table-column label="时间" align="center">
                        <template #default="scope">
                            <label class="weather-hour-row-data_time"> {{ scope.row.data_time.slice(11, 16) }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="天气" align="center">
                        <template #default="scope">
                            <label class="weather-hour-row-text"> {{ scope.row.text }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="温度" align="center">
                        <template #default="scope">
                            <label class="weather-hour-row-temp_fc"> {{ scope.row.temp_fc + "℃" }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="风力" align="center">
                        <template #default="scope">
                            <label class="weather-hour-row-wind_class"> {{ scope.row.wind_class }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="风向" align="center">
                        <template #default="scope">
                            <label class="weather-hour-row-wind_dir"> {{ scope.row.wind_dir }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="相对湿度" align="center">
                        <template #default="scope">
                            <label class="weather-hour-row-rh"> {{ scope.row.rh + "%" }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="体感温度" align="center">
                        <template #default="scope">
                            <label class="weather-hour-row-feels_like"> {{ scope.row.feels_like + "℃" }} </label>
                        </template>
                    </el-table-column>
                </el-table>
                
                <!-- 日预报表格（选择日预报时显示） -->
                <el-table v-else :data="weatherDaysData" class="result-weather-day-table" :header-cell-style="{
                    'font-size': 'large',
                    'font-weight': 'normal',
                    'color': '#212121',
                    'background-color': '#FFC288'
                }">
                    <el-table-column label="日期" align="center">
                        <template #default="scope">
                            <label class="weather-day-row-date"> {{ (scope.row.date + " " + scope.row.week).slice(5, 14) }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="天气" align="center">
                        <template #default="scope">
                            <label class="weather-day-row-text">
                                {{ scope.row.text_day == scope.row.text_night ? scope.row.text_day : scope.row.text_day + "~" + scope.row.text_night }}
                            </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="温度" align="center">
                        <template #default="scope">
                            <label class="weather-day-row-temp"> {{ scope.row.low + "℃ ~ " + scope.row.high + "℃" }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="风力" align="center">
                        <template #default="scope">
                            <label class="weather-day-row-wc_day">
                                {{ scope.row.wc_day == scope.row.wc_night ? scope.row.wc_day : scope.row.wc_day + "~" + scope.row.wc_night }}
                            </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="降水概率" align="center">
                        <template #default="scope">
                            <label class="weather-day-row-pop"> {{ scope.row.pop + "%" }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="相对湿度" align="center">
                        <template #default="scope">
                            <label class="weather-day-row-rh"> {{ scope.row.minrh + "% ~ " + scope.row.maxrh + "%" }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="能见度" align="center">
                        <template #default="scope">
                            <label class="weather-day-row-vis"> {{ (scope.row.vis / 1000).toString() + "km" }} </label>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="flex-container">
            <!-- 信息栏：机场 -->
            <div class="result-airports-container" id="result-airport">
                <p>
                    <img src="../assets/toolbar/indexes/airport.svg" style="width: 24px;">
                    <label> 机场：From Rapid API </label>
                </p>

                <!-- 机场表格 -->
                <el-table :data="city.airports" class="result-airports-table" :header-cell-style="{
                    'font-size': 'large',
                    'font-weight': 'normal',
                    'color': '#212121',
                    'background-color': '#D4F4FF'
                }">
                    <el-table-column label="全名" align="center">
                        <template #default="scope">
                            <label class="airports-row-AirportName"> {{ scope.row.AirportName }} </label>
                        </template>
                    </el-table-column>
                    <el-table-column label="代码" align="center" width="100">
                        <template #default="scope">
                            <label class="airports-row-AirportCode"> {{ scope.row.AirportCode }} </label>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 信息栏：相关网页 -->
            <div class="result-webs-container" id="result-webs">
                <p>
                    <img src="../assets/toolbar/indexes/webs.svg" style="width: 24px;">
                    <label> 相关网页：From Rapid API </label>
                </p>

                <div v-for="web in city['webs']" class="result-webs">
                    <h2> {{ web.title }} </h2>
                    <a :href="web.url"> {{ web.url }} </a>
                    <p> {{ web.description }} </p>
                    <hr>
                </div>
            </div>
        </div>

        <!-- 信息栏：物价信息 -->
        <div class="result-prices-container" id="result-prices">
            <p>
                <img src="../assets/toolbar/indexes/prices.svg" style="width: 24px;">
                <label> 物价信息：From Rapid API </label>
            </p>

            <!-- 物价信息表格 -->
            <el-table :data="city.prices" class="result-prices-table" :header-cell-style="{
                'font-size': 'large',
                'font-weight': 'normal',
                'color': '#212121',
                'background-color': '#E5B4E2'
            }">
                <el-table-column label="类型" align="center" width="300">
                    <template #default="scope">
                        <label class="prices-row-category_name"> {{ scope.row.category_name }} </label>
                    </template>
                </el-table-column>
                <el-table-column label="名称" align="center">
                    <template #default="scope">
                        <label class="prices-row-item_name"> {{ scope.row.item_name }} </label>
                    </template>
                </el-table-column>
                <el-table-column label="最低价" align="center" width="140">
                    <template #default="scope">
                        <label class="prices-row-min"> {{ scope.row.min }} </label>
                    </template>
                </el-table-column>
                <el-table-column label="均价" align="center" width="140">
                    <template #default="scope">
                        <label class="prices-row-avg"> {{ scope.row.avg }} </label>
                    </template>
                </el-table-column>
                <el-table-column label="最高价" align="center" width="140">
                    <template #default="scope">
                        <label class="prices-row-max"> {{ scope.row.max }} </label>
                    </template>
                </el-table-column>
                <el-table-column label="单位" align="center" width="80">
                    <template #default="scope">
                        <label v-if="scope.row.measure == 'money'"> {{ scope.row.currency_code }} </label>
                        <label v-else> % </label>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
 
<script>
import AMapLoader from "@amap/amap-jsapi-loader";  //高德
import { getCityWeather } from "../axios/webAPI/cityWeather.js";
import { getCityGEO } from "../axios/webAPI/cityGEO";
import { getCityAir } from "../axios/webAPI/cityAir.js";
import { getCityCountry } from "../axios/webAPI/cityCountry.js";
import { getCityAirport } from "../axios/webAPI/cityAirport.js";
import { getCityWebs } from "../axios/webAPI/cityWebs.js";
import { getCityPrices } from "../axios/webAPI/cityPrices.js";
import { ElRadioButton, ElTableColumn, ElRadioGroup, ElTable } from "element-plus";

//高德：取出预先存入本地存储的token，设置安全密钥
window._AMapSecurityConfig = {
    securityJsCode: localStorage.getItem("gaodeSecurityKey"),
}

export default {
    data() {
        return {
            city: {},  //展示城市

            //展示城市所属国家
            country: {
                code: "",       //国家编码
                currency: {
                    code: "",   //货币编码
                    symbol: ""  //货币符号
                },
                flag: ""        //国旗url
            },

            currentLocalTime: "Getting locale time...",  //当地时间

            //高德需要承接的数据
            map: null,
            mouseTool: null,
            overlays: [],
            auto: null,
            placeSearch: null,

            weatherHoursData: [],      //天气小时预报数据
            weatherDaysData: [],       //天气日预报数据
            weatherDisplay: "日预报",   //天气展示模式
            
            airRealTimeAqi: {},        //空气实时信息
            airRealTimePollutant: "",  //空气实时污染物
            airRealTimeRanks: {        //空气城市实时排行
                aqi_ranking: -1,    //排名数
                beat_rate: "0.00%"  //击败率
            },
        };
    },
    mounted() {
        this.city = JSON.parse(localStorage.getItem("selectedCity"));  //取城市的基本信息
        this.city["population"] = 0;  //给city对象添加population域
        this.city["airports"] = [];   //给city对象添加airports域
        this.city["webs"] = [];       //给city对象添加webs域
        this.city["prices"] = [];     //给city对象添加prices域

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
    beforeDestroy() {
        //每次路由转出前销毁地图对象，节省内存
        this.map.destroy();
        this.map = null;
    },
    methods: {
        //加载城市高德地图
        initMap: function() {
            var that = this;

            AMapLoader.load({
                key: localStorage.getItem("gaodeDeveloperKey"),  //取出预先存入本地存储的token
                version: "2.0",
                plugins: [
                    "AMap.Scale",
                    "AMap.ToolBar",
                    "AMap.ControlBar",
                    "AMap.MouseTool",
                    "AMap.MapType",
                    "AMap.HawkEye"
                ]
            }).then((AMap) => {
                // 初始化地图
                this.map = new AMap.Map("gaode-map", {
                    viewMode: "2D",
                    zoom: 13,
                    center: [this.city.lon, this.city.lat],  //以城市经纬度作为地图中心位置
                    resizeEnable: true,
                    willReadFrequently: true  //消除警告，提升性能
                });

                let toolBar = new AMap.ToolBar({
                    position: {
                        bottom: '60px',
                        left: '35px'
                    }
                });
                let controlBar = new AMap.ControlBar({
                    position: {
                        top: '10px',
                        left: '10px',
                    },
                });
                this.map.addControl(new AMap.Scale());   //添加左下角的比例尺
                this.map.addControl(toolBar);            //添加右下角的放大缩小
                this.map.addControl(controlBar);         //添加方向盘
                this.map.addControl(new AMap.MapType()); //添加右上角的标准图和卫星图  和路况
                this.map.addControl(new AMap.HawkEye()); //添加地图放大镜
            }).catch(e => {
                console.log(e);
            });
        },
        //根据时区信息，将当前时间转换为当地时间
        getTime: function() {
            //设置：将当前城市时区传入
            const targetOptions = {
                timeZone: this.city.timezone
            };

            //使用toLocaleString方法，显示当地时间和时区信息
            this.currentLocalTime = new Date().toLocaleString({}, targetOptions) + "(" + this.city.time_converter + ")";
        },
        //开始按秒更新当地时间
        tickTime: function() {
            setInterval(this.getTime, 500);
        },
        //调用接口，获取城市天气信息
        getWeather: function () {
            var that = this;

            getCityWeather("/hour", {
                hours: 24,  //获取24小时的信息
                areacode: this.city.areacode  //城市编码
            }).then(res => {
                that.weatherHoursData = res.result.hourly_fcsts;
            }, err => {
                console.log(err);
            });

            getCityWeather("/day", {
                days: 15,  //获取15天的信息
                areacode: this.city.areacode  //城市编码
            }).then(res => {
                that.weatherDaysData = res.result.daily_fcsts;
            }, err => {
                console.log(err);
            });
        },
        //将城市经纬度修改为标准格式
        trimmedCityLocation: function() {
            var latFlag = "+", lonFlag = "+";

            if (this.city.lat < 0) {
                latFlag = "-"
            }

            if (this.city.lon < 0) {
                lonFlag = "-";
            }

            return latFlag + this.city.lat.toString() + lonFlag + this.city.lon.toString();
        },
        //调用接口，获取城市所属地区信息
        getInfo: async function() {
            var that = this;

            await getCityGEO("/geo/cities", {
                namePrefix: this.city.name,           //城市名前缀（用城市全名传入）
                location: this.trimmedCityLocation()  //经纬度
            }).then(res => {
                that.country.code = res.data[0].countryCode;       //获取城市所属国家编码
                that.city["population"] = res.data[0].population;  //获取城市人口
            }, err => {
                console.log(err);
            });

            setTimeout(async function() {
                await getCityGEO("/locale/currencies", {
                    countryId: that.country.code  //国家编码
                }).then(res => {
                    that.country.currency.code = res.data[0].code;      //获取货币编码
                    that.country.currency.symbol = res.data[0].symbol;  //获取货币符号
                }, err => {
                    console.log(err);
                })
            }, 1000);
        },
        //调用接口，获取城市空气信息
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
        //调用接口，获取城市所属国家信息
        getCountry: function() {
            var that = this;

            getCityCountry("/country/" + this.city.country).then(res => {
                if (res.length > 0) {
                    that.country.flag = res[0].flag.officialflag.svg;  //获取国旗url（可能VPN）
                }
            }, err => {
                console.log(err);
            });
        },
        //调用接口，获取城市机场信息
        getAirport: function() {
            var that = this;

            getCityAirport("/airports/" + this.city.name, {
                page: "1",
                limit: "20",
                sortBy: 'AirportName:asc'
            }).then(res => {
                that.city["airports"] = res.results;
            }, err => {
                console.log(err);
            });
        },
        //调用接口，获取城市相关网页信息
        getWebs: function() {
            var that = this;

            getCityWebs("/", {
                query: this.city.name,   //关键词（以城市名传入）
                limit: 300,              //结果条数
                related_keywords: false  //返回相关关键词
            }).then(res => {
                that.city["webs"] = res.results;
            }, err => {
                console.log(err);
            });
        },
        //调用接口，获取城市物价信息
        getPrices: function() {
            var that = this;

            getCityPrices("/prices", {
                city_name: this.city.name,       //城市名
                country_name: this.city.country  //国家名
            }).then(res => {
                that.city["prices"] = res.prices;
            }, err => {
                console.log(err);
            });
        },
        //国旗图片无法显示时，动态切换src
        handleCountryFlagError: function() {
            this.country.flag = require("../assets/noPicture.svg");
        }
    },
    components: {
        "el-table": ElTable,
        "el-table-column": ElTableColumn,
        "el-radio-group": ElRadioGroup,
        "el-radio-button": ElRadioButton
    }
}
</script>
 
<style scoped>
.city-detail {
    z-index: 9999;
}
.result-position-container {
    margin-left: 2%;
    margin-top: 4%;
    margin-bottom: 2%;
    text-align: center;
    width: 95%;
    height: 20%;
    background-color: #F9F87190;
    border: 10px solid #F9F87190;
    border-radius: 5px;
}
.result-position-container > p {
    text-align: center;
    margin: 0;
    padding-top: 20px;
    padding-bottom: 20px;
    height: 36px;
    font-size: x-large;
    font-weight: lighter;
    color: black;
    background-color: #F9F871;
}
.result-position-container > div > p {
    font-size: larger;
}
.flex-container {
    display: flex;
}
.result-map-container {
    width: 65%;
    height: 600px;
    margin-left: 2%;
    background-color: #19688390;
    border: 10px solid #19688390;
    border-radius: 5px;
}
.result-map-container p {
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
#gaode-map {
    width: 100%;
    height: 525px;
    margin: 0;
    font-family: "微软雅黑";
}
.result-info-container {
    width: 30%;
    height: 600px;
    margin-left: 2%;
    margin-right: 2%;
    background-color: #32415790;
    border: 10px solid #32415790;
    border-radius: 5px;
}
.result-info-container p {
    text-align: center;
    margin: 0;
    padding-top: 20px;
    padding-bottom: 20px;
    height: 36px;
    font-size: x-large;
    font-weight: lighter;
    color: white;
    background-color: #324157;
}
.result-info-container div {
    background-color: #ffffff90;
    height: 525px;
}
.result-info-container ul {
    margin: 0;
    list-style-type: square;
}
.result-info-container li {
    padding-top: 30px;
    font-size: 22px;
}
.result-info-country-flag {
    width: 40%;
    height: 40%;
}
.result-air-container {
    width: 35%;
    height: 600px;
    margin-left: 2%;
    margin-top: 2%;
    background-color: #00706050;
    border: 10px solid #00706050;
    border-radius: 5px;
}
.result-air-container > p {
    text-align: center;
    margin: 0;
    padding-top: 20px;
    padding-bottom: 20px;
    height: 36px;
    font-size: x-large;
    font-weight: lighter;
    color: white;
    background-color: #007060;
}
.result-air-aqi > p {
    margin-left: 3%;
    font-size: x-large;
}
.result-air-card {
    float: left;
    margin-left: 3%;
    margin-bottom: 4%;
    width: 20%;
    height: 120px;
    background-color: #C5FCEE;
    border: 5px solid white;
    border-radius: 10px;
}
.result-air-card > h4 {
    text-align: center;
    margin: 0;
    margin-top: 5px;
    margin-bottom: 5px;
}
.result-air-card > p {
    text-align: center;
    margin: 0;
    margin-top: 20px;
    font-size: xx-large;
    font-weight: lighter;
    color: #007060;
}
.result-air-ranking > p {
    margin-left: 3%;
    font-size: x-large;
}
.result-air-ranking > label {
    margin-left: 3%;
    font-size: larger;
}
.result-weather-container {
    width: 56.5%;
    height: 600px;
    margin-left: 2%;
    margin-top: 2%;
    background-color: #E1A0C290;
    border: 10px solid #E1A0C290;
    border-radius: 5px;
}
.result-weather-header {
    height: 36px;
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: #E1A0C2;
}
.result-weather-header > label {
    font-size: x-large;
    font-weight: lighter;
    color: white;
}
.result-weather-radio {
    margin-left: 2%;
    width: 30%;
}
:deep(.el-radio-button) {
    --el-radio-button-checked-border-color: #FFC288;
}
:deep(.el-radio-button .el-radio-button__inner) {
    color: #464646;
    font-size: large;
}
:deep(.el-radio-button .el-radio-button__inner:hover) {
    color: #E1A0C2;
}
:deep(.el-radio-button.is-active .el-radio-button__inner) {
    color: #212121;
    background-color: #FFC288;
}
.result-weather-hour-table {
    width: 100%;
    height: 520px;
}
.result-weather-day-table {
    width: 100%;
    height: 520px;
}
:deep(.result-weather-container .el-table td) {
    padding-top: 15px;
    font-size: 16px;
    padding-bottom: 15px;
    background-color: #F9F87130;
}
:deep(.result-weather-container .el-table td,.building-top .el-table th.is-leaf) {
    border-bottom: 4px solid #E1A0C2;
}
.result-airports-container {
    width: 30%;
    height: 600px;
    margin-left: 2%;
    margin-top: 2%;
    background-color: #386E9750;
    border: 10px solid #386E9750;
    border-radius: 5px;
}
.result-airports-container > p {
    text-align: center;
    margin: 0;
    padding-top: 20px;
    padding-bottom: 20px;
    height: 36px;
    font-size: x-large;
    font-weight: lighter;
    color: white;
    background-color: #386E97;
}
.result-airports-table {
    width: 100%;
    height: 525px;
}
:deep(.result-airports-container .el-table td) {
    padding-top: 30px;
    font-size: 19px;
    padding-bottom: 30px;
    background-color: #adc5df;
}
:deep(.result-airports-container .el-table td,.building-top .el-table th.is-leaf) {
    border-bottom: 4px solid #386E97;
}
.result-webs-container {
    width: 61.5%;
    height: 600px;
    overflow-y: scroll;
    margin-left: 2%;
    margin-top: 2%;
    background-color: #8251c6a0;
    border: 10px solid #8251c6a0;
    border-radius: 5px;
}
.result-webs-container > p {
    text-align: center;
    margin: 0;
    padding-top: 20px;
    padding-bottom: 20px;
    height: 36px;
    font-size: x-large;
    font-weight: lighter;
    color: white;
    background-color: #8251c6;
}
.result-webs:hover {
    background-color: #ffffff90;
}
.result-webs > h2 {
    margin-left: 2%;
}
.result-webs > a {
    margin-left: 2%;
}
.result-webs > p {
    margin-left: 2%;
    font-size: large;
}
.result-prices-container {
    width: 94.7%;
    height: 600px;
    margin-left: 2%;
    margin-top: 2%;
    margin-bottom: 2%;
    background-color: #db57dba0;
    border: 10px solid #db57dba0;
    border-radius: 5px;
}
.result-prices-container > p {
    text-align: center;
    margin: 0;
    padding-top: 20px;
    padding-bottom: 20px;
    height: 36px;
    font-size: x-large;
    font-weight: lighter;
    color: white;
    background-color: #db57db;
}
.result-prices-table {
    width: 100%;
    height: 525px;
}
:deep(.result-prices-container .el-table td) {
    padding-top: 25px;
    font-size: 20px;
    padding-bottom: 25px;
    background-color: #db57db30;
}
:deep(.result-prices-container .el-table td,.building-top .el-table th.is-leaf) {
    border-bottom: 4px solid #db57db;
}
</style>
<!-- <style>
/* 隐藏高德logo  */
.amap-logo {
    display: none !important;
}
/* 隐藏高德版权  */
.amap-copyright {
    display: none !important;
}
</style> -->