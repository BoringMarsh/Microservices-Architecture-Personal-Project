<template>
    <div class="city-detail">
        <div class="result-position-container" id="result-position">
            <p> 详细位置：From APISpace </p>

            <div>
                <p> {{ city.path }} </p>
            </div>
        </div>

        <div class="flex-container">
            <div class="result-map-container" id="result-map">
                <p> 城市地图：From Gaode </p>
                <!-- <div id="gaode-map"></div> -->
            </div>

            <div class="result-info-container" id="result-info">
                <p> 地区信息：From Rapid API & APISpace </p>

                <div>
                    <ul>
                        <li> 当地时间：{{ currentLocalTime }} </li>
                        <li> 经纬度：{{ city.lon + ", " + city.lat }} </li>
                        <li> 人口：{{ city.population }} </li>
                        <li> 国家：{{ city.country }} </li>
                        <li> 货币：{{ country.currency.code + "(" + country.currency.symbol + ")" }} </li>
                        <li> 国旗：<img :src="country.flag" alt="../assets/noPicture.svg"> </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="flex-container">
            <div class="result-air-container" id="result-air">
                <p> 城市空气：From APISpace </p>
                
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
                        <label style="color: #007060;"> {{ airRealTimeRanks.result.realtimeRanks[0].hourlyRanking.aqi_ranking }} </label>
                    </label>
                    <br>
                    <label>
                        打败了
                        <label style="color: #007060;"> {{ airRealTimeRanks.result.realtimeRanks[0].hourlyRanking.beat_rate }} </label>
                        的城市
                    </label>
                </div>
            </div>

            <div class="result-weather-container" id="result-weather">
                <div class="result-weather-header">
                    <el-radio-group v-model="weatherDisplay" class="result-weather-radio">
                        <el-radio-button label="日预报"></el-radio-button>
                        <el-radio-button label="小时预报"></el-radio-button>
                    </el-radio-group>
                    <label> 城市天气：From APISpace </label>
                </div>
                
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
            <div class="result-airports-container" id="result-airport">
                <p> 机场：From Rapid API </p>

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

            <div class="result-webs-container" id="result-webs">
                <p> 相关网页：From Rapid API </p>

                <div v-for="web in city['webs']" class="result-webs">
                    <h2> {{ web.title }} </h2>
                    <a :href="web.url"> {{ web.url }} </a>
                    <p> {{ web.description }} </p>
                    <hr>
                </div>
            </div>
        </div>

        <div class="result-prices-container" ref="result-prices">
            <p> 物价信息：From Rapid API </p>

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
import AMapLoader from "@amap/amap-jsapi-loader";
import { getCityWeather } from "../axios/cityWeather.js";
import { getCityGEO } from "../axios/cityGEO";
import { getCityAir } from "../axios/cityAir.js";
import { getCityCountry } from "../axios/cityCountry.js";
import { getCityAirport } from "../axios/cityAirport.js";
import { getCityWebs } from "../axios/cityWebs.js";
import { getCityPrices } from "../axios/cityPrices";
import { ElRadioButton, ElTableColumn, ElRadioGroup, ElTable } from "element-plus";

// 设置安全密钥
window._AMapSecurityConfig = {
    securityJsCode: localStorage.getItem("gaodeSecurityKey"),
}

export default {
    data() {
        return {
            city: {},
            country: {
                code: "",
                currency: {
                    code: "",
                    symbol: ""
                },
                flag: ""
            },

            currentLocalTime: "Getting locale time...",

            map: null,
            mouseTool: null,
            overlays: [],
            auto: null,
            placeSearch: null,

            weatherHoursData: [{ "text": "阴", "code": "02", "temp_fc": 18, "wind_class": "<3级", "wind_speed": 2.5, "wind_dir": "北风", "wind_angle": 15, "rh": 59, "prec": 0, "pressure": 1015, "clouds": 63, "feels_like": 17, "data_time": "2023-10-18 09:00:00" }, { "text": "晴", "code": "00", "temp_fc": 20, "wind_class": "3~4级", "wind_speed": 4.3, "wind_dir": "北风", "wind_angle": 15, "rh": 49, "prec": 0, "pressure": 1014, "clouds": 34, "feels_like": 18, "data_time": "2023-10-18 10:00:00" }, { "text": "晴", "code": "00", "temp_fc": 22, "wind_class": "3~4级", "wind_speed": 6.2, "wind_dir": "北风", "wind_angle": 14, "rh": 40, "prec": 0, "pressure": 1014, "clouds": 10, "feels_like": 19, "data_time": "2023-10-18 11:00:00" }, { "text": "晴", "code": "00", "temp_fc": 22, "wind_class": "3~4级", "wind_speed": 5.3, "wind_dir": "北风", "wind_angle": 350, "rh": 35, "prec": 0, "pressure": 1013, "clouds": 6, "feels_like": 20, "data_time": "2023-10-18 12:00:00" }, { "text": "晴", "code": "00", "temp_fc": 22, "wind_class": "3~4级", "wind_speed": 5.6, "wind_dir": "西北风", "wind_angle": 323, "rh": 32, "prec": 0, "pressure": 1012, "clouds": 3, "feels_like": 19, "data_time": "2023-10-18 13:00:00" }, { "text": "晴", "code": "00", "temp_fc": 22, "wind_class": "4~5级", "wind_speed": 6.7, "wind_dir": "西北风", "wind_angle": 303, "rh": 28, "prec": 0, "pressure": 1011, "clouds": 0, "feels_like": 19, "data_time": "2023-10-18 14:00:00" }, { "text": "晴", "code": "00", "temp_fc": 22, "wind_class": "3~4级", "wind_speed": 6.2, "wind_dir": "西风", "wind_angle": 288, "rh": 26, "prec": 0, "pressure": 1011, "clouds": 3, "feels_like": 19, "data_time": "2023-10-18 15:00:00" }, { "text": "晴", "code": "00", "temp_fc": 22, "wind_class": "3~4级", "wind_speed": 6.3, "wind_dir": "西风", "wind_angle": 272, "rh": 25, "prec": 0, "pressure": 1011, "clouds": 6, "feels_like": 19, "data_time": "2023-10-18 16:00:00" }, { "text": "晴", "code": "00", "temp_fc": 22, "wind_class": "4~5级", "wind_speed": 6.7, "wind_dir": "西风", "wind_angle": 258, "rh": 24, "prec": 0, "pressure": 1011, "clouds": 10, "feels_like": 19, "data_time": "2023-10-18 17:00:00" }, { "text": "晴", "code": "00", "temp_fc": 19, "wind_class": "3~4级", "wind_speed": 6.2, "wind_dir": "西风", "wind_angle": 263, "rh": 32, "prec": 0, "pressure": 1011, "clouds": 10, "feels_like": 17, "data_time": "2023-10-18 18:00:00" }, { "text": "晴", "code": "00", "temp_fc": 17, "wind_class": "3~4级", "wind_speed": 5.9, "wind_dir": "西风", "wind_angle": 269, "rh": 40, "prec": 0, "pressure": 1011, "clouds": 10, "feels_like": 14, "data_time": "2023-10-18 19:00:00" }, { "text": "晴", "code": "00", "temp_fc": 15, "wind_class": "3~4级", "wind_speed": 5.5, "wind_dir": "西风", "wind_angle": 275, "rh": 48, "prec": 0, "pressure": 1012, "clouds": 10, "feels_like": 12, "data_time": "2023-10-18 20:00:00" }, { "text": "晴", "code": "00", "temp_fc": 14, "wind_class": "3~4级", "wind_speed": 3.8, "wind_dir": "西风", "wind_angle": 276, "rh": 52, "prec": 0, "pressure": 1012, "clouds": 10, "feels_like": 13, "data_time": "2023-10-18 21:00:00" }, { "text": "晴", "code": "00", "temp_fc": 14, "wind_class": "<3级", "wind_speed": 2.1, "wind_dir": "西风", "wind_angle": 276, "rh": 57, "prec": 0, "pressure": 1012, "clouds": 10, "feels_like": 14, "data_time": "2023-10-18 22:00:00" }, { "text": "晴", "code": "00", "temp_fc": 14, "wind_class": "<3级", "wind_speed": 0.5, "wind_dir": "西风", "wind_angle": 282, "rh": 62, "prec": 0, "pressure": 1012, "clouds": 10, "feels_like": 14, "data_time": "2023-10-18 23:00:00" }, { "text": "晴", "code": "00", "temp_fc": 13, "wind_class": "<3级", "wind_speed": 1.4, "wind_dir": "西北风", "wind_angle": 308, "rh": 63, "prec": 0, "pressure": 1012, "clouds": 10, "feels_like": 13, "data_time": "2023-10-19 00:00:00" }, { "text": "晴", "code": "00", "temp_fc": 12, "wind_class": "<3级", "wind_speed": 2.4, "wind_dir": "西北风", "wind_angle": 313, "rh": 65, "prec": 0, "pressure": 1012, "clouds": 10, "feels_like": 11, "data_time": "2023-10-19 01:00:00" }, { "text": "晴", "code": "00", "temp_fc": 11, "wind_class": "3~4级", "wind_speed": 3.3, "wind_dir": "西北风", "wind_angle": 314, "rh": 67, "prec": 0, "pressure": 1012, "clouds": 10, "feels_like": 9, "data_time": "2023-10-19 02:00:00" }, { "text": "晴", "code": "00", "temp_fc": 11, "wind_class": "<3级", "wind_speed": 3, "wind_dir": "西北风", "wind_angle": 321, "rh": 62, "prec": 0, "pressure": 1012, "clouds": 7, "feels_like": 10, "data_time": "2023-10-19 03:00:00" }, { "text": "晴", "code": "00", "temp_fc": 11, "wind_class": "<3级", "wind_speed": 2.8, "wind_dir": "西北风", "wind_angle": 330, "rh": 56, "prec": 0, "pressure": 1012, "clouds": 3, "feels_like": 10, "data_time": "2023-10-19 04:00:00" }, { "text": "晴", "code": "00", "temp_fc": 11, "wind_class": "<3级", "wind_speed": 2.7, "wind_dir": "北风", "wind_angle": 339, "rh": 51, "prec": 0, "pressure": 1013, "clouds": 1, "feels_like": 10, "data_time": "2023-10-19 05:00:00" }, { "text": "晴", "code": "00", "temp_fc": 12, "wind_class": "3~4级", "wind_speed": 3.5, "wind_dir": "北风", "wind_angle": 348, "rh": 49, "prec": 0, "pressure": 1013, "clouds": 0, "feels_like": 10, "data_time": "2023-10-19 06:00:00" }, { "text": "晴", "code": "00", "temp_fc": 13, "wind_class": "3~4级", "wind_speed": 4.3, "wind_dir": "北风", "wind_angle": 353, "rh": 47, "prec": 0, "pressure": 1014, "clouds": 0, "feels_like": 11, "data_time": "2023-10-19 07:00:00" }, { "text": "晴", "code": "00", "temp_fc": 14, "wind_class": "3~4级", "wind_speed": 5.2, "wind_dir": "北风", "wind_angle": 357, "rh": 45, "prec": 0, "pressure": 1015, "clouds": 0, "feels_like": 11, "data_time": "2023-10-19 08:00:00" }],
            weatherDaysData: [{ "text_day": "晴", "code_day": "00", "text_night": "晴", "code_night": "00", "high": 23, "low": 11, "wc_day": "3~4级", "wd_day": "北风", "wc_night": "<3级", "wd_night": "无持续风向", "wa_day": 342, "wa_night": 0, "ws_day": 4.1, "ws_night": 1.9, "pop": 20, "pressure": 1011, "maxrh": 68, "minrh": 20, "vis": 9864, "clouds_day": 12, "clouds_night": 40, "uv": 7, "date": "2023-10-18", "week": "星期三" }, { "text_day": "晴", "code_day": "00", "text_night": "晴", "code_night": "00", "high": 21, "low": 7, "wc_day": "3~4级", "wd_day": "北风", "wc_night": "<3级", "wd_night": "无持续风向", "wa_day": 342, "wa_night": 0, "ws_day": 4.1, "ws_night": 1.9, "pop": 20, "pressure": 1016, "maxrh": 30, "minrh": 16, "vis": 10000, "clouds_day": 21, "clouds_night": 0, "uv": 8, "date": "2023-10-19", "week": "星期四" }, { "text_day": "晴", "code_day": "00", "text_night": "晴", "code_night": "00", "high": 18, "low": 6, "wc_day": "<3级", "wd_day": "无持续风向", "wc_night": "<3级", "wd_night": "无持续风向", "wa_day": 0, "wa_night": 0, "ws_day": 1.9, "ws_night": 1.9, "pop": 20, "pressure": 1020, "maxrh": 39, "minrh": 16, "vis": 10000, "clouds_day": 0, "clouds_night": 0, "uv": 8, "date": "2023-10-20", "week": "星期五" }, { "text_day": "晴", "code_day": "00", "text_night": "晴", "code_night": "00", "high": 20, "low": 6, "wc_day": "<3级", "wd_day": "无持续风向", "wc_night": "<3级", "wd_night": "无持续风向", "wa_day": 0, "wa_night": 0, "ws_day": 1.9, "ws_night": 1.9, "pop": 20, "pressure": 1017, "maxrh": 53, "minrh": 23, "vis": 10000, "clouds_day": 0, "clouds_night": 0, "uv": 8, "date": "2023-10-21", "week": "星期六" }, { "text_day": "晴", "code_day": "00", "text_night": "晴", "code_night": "00", "high": 21, "low": 8, "wc_day": "<3级", "wd_day": "无持续风向", "wc_night": "<3级", "wd_night": "无持续风向", "wa_day": 0, "wa_night": 0, "ws_day": 1.9, "ws_night": 1.9, "pop": 20, "pressure": 1013, "maxrh": 54, "minrh": 25, "vis": 12500, "clouds_day": 0, "clouds_night": 0, "uv": 7, "date": "2023-10-22", "week": "星期日" }, { "text_day": "多云", "code_day": "01", "text_night": "晴", "code_night": "00", "high": 20, "low": 7, "wc_day": "<3级", "wd_day": "无持续风向", "wc_night": "<3级", "wd_night": "无持续风向", "wa_day": 0, "wa_night": 0, "ws_day": 1.9, "ws_night": 1.9, "pop": 20, "pressure": 1012, "maxrh": 63, "minrh": 36, "vis": 10000, "clouds_day": 0, "clouds_night": 1, "uv": 7, "date": "2023-10-23", "week": "星期一" }, { "text_day": "晴", "code_day": "00", "text_night": "晴", "code_night": "00", "high": 22, "low": 7, "wc_day": "<3级", "wd_day": "无持续风向", "wc_night": "<3级", "wd_night": "无持续风向", "wa_day": 0, "wa_night": 0, "ws_day": 1.9, "ws_night": 1.9, "pop": 20, "pressure": 1011, "maxrh": 61, "minrh": 28, "vis": 10000, "clouds_day": 0, "clouds_night": 0, "uv": 7, "date": "2023-10-24", "week": "星期二" }, { "text_day": "多云", "code_day": "01", "text_night": "多云", "code_night": "01", "high": 23, "low": 9, "wc_day": "<3级", "wd_day": "南风", "wc_night": "<3级", "wd_night": "北风", "wa_day": 166, "wa_night": 342, "ws_day": 1.9, "ws_night": 1.9, "pop": 20, "pressure": 1011, "maxrh": 61, "minrh": 38, "vis": 10000, "clouds_day": 0, "clouds_night": 0, "uv": 7, "date": "2023-10-25", "week": "星期三" }, { "text_day": "多云", "code_day": "01", "text_night": "多云", "code_night": "01", "high": 22, "low": 10, "wc_day": "<3级", "wd_day": "南风", "wc_night": "<3级", "wd_night": "西南风", "wa_day": 166, "wa_night": 211, "ws_day": 1.9, "ws_night": 1.9, "pop": 20, "pressure": 1010, "maxrh": 68, "minrh": 44, "vis": 10000, "clouds_day": 0, "clouds_night": 0, "uv": 6, "date": "2023-10-26", "week": "星期四" }, { "text_day": "多云", "code_day": "01", "text_night": "多云", "code_night": "01", "high": 20, "low": 9, "wc_day": "<3级", "wd_day": "南风", "wc_night": "<3级", "wd_night": "北风", "wa_day": 166, "wa_night": 342, "ws_day": 1.9, "ws_night": 1.9, "pop": 60, "pressure": 1012, "maxrh": 61, "minrh": 34, "vis": 10000, "clouds_day": 0, "clouds_night": 47, "uv": 7, "date": "2023-10-27", "week": "星期五" }, { "text_day": "多云", "code_day": "01", "text_night": "多云", "code_night": "01", "high": 20, "low": 7, "wc_day": "<3级", "wd_day": "南风", "wc_night": "<3级", "wd_night": "北风", "wa_day": 166, "wa_night": 342, "ws_day": 1.9, "ws_night": 1.9, "pop": 20, "pressure": 1014, "maxrh": 44, "minrh": 27, "vis": 10000, "clouds_day": 31, "clouds_night": 35, "uv": 7, "date": "2023-10-28", "week": "星期六" }, { "text_day": "多云", "code_day": "01", "text_night": "多云", "code_night": "01", "high": 20, "low": 7, "wc_day": "<3级", "wd_day": "东北风", "wc_night": "<3级", "wd_night": "北风", "wa_day": 31, "wa_night": 342, "ws_day": 1.9, "ws_night": 1.9, "pop": 20, "pressure": 1014, "maxrh": 49, "minrh": 33, "vis": 10000, "clouds_day": 66, "clouds_night": 51, "uv": 7, "date": "2023-10-29", "week": "星期日" }, { "text_day": "多云", "code_day": "01", "text_night": "多云", "code_night": "01", "high": 19, "low": 7, "wc_day": "<3级", "wd_day": "南风", "wc_night": "<3级", "wd_night": "西南风", "wa_day": 166, "wa_night": 211, "ws_day": 1.9, "ws_night": 1.9, "pop": 20, "pressure": 1012, "maxrh": 55, "minrh": 37, "vis": 10000, "clouds_day": 69, "clouds_night": 75, "uv": 7, "date": "2023-10-30", "week": "星期一" }, { "text_day": "多云", "code_day": "01", "text_night": "多云", "code_night": "01", "high": 17, "low": 8, "wc_day": "<3级", "wd_day": "南风", "wc_night": "<3级", "wd_night": "西北风", "wa_day": 166, "wa_night": 301, "ws_day": 1.9, "ws_night": 1.9, "pop": 20, "pressure": 1012, "maxrh": 59, "minrh": 37, "vis": 10000, "clouds_day": 76, "clouds_night": 62, "uv": 7, "date": "2023-10-31", "week": "星期二" }, { "text_day": "阴", "code_day": "02", "text_night": "多云", "code_night": "01", "high": 13, "low": 5, "wc_day": "<3级", "wd_day": "北风", "wc_night": "<3级", "wd_night": "东南风", "wa_day": 342, "wa_night": 121, "ws_day": 1.9, "ws_night": 1.9, "pop": 30, "pressure": 1015, "maxrh": 49, "minrh": 40, "vis": 10000, "clouds_day": 88, "clouds_night": 56, "uv": 4, "date": "2023-11-01", "week": "星期三" }],
            weatherDisplay: "日预报",
            
            airRealTimeAqi: {"aqi":18,"aqi_level":"优","pm10":14,"pm25":3,"no2":5,"so2":3,"co":0.2,"o3":56},
            airRealTimePollutant: "",
            airRealTimeRanks:
                {
                    "status": 0,
                    "result": {
                        "realtimeRanks": [{
                            "location": {
                                "areacode": "101010100",
                                "name": "北京",
                                "country": "中国",
                                "path": "北京,北京市,北京市,中国"
                            },
                            "hourlyRanking": {
                                "aqi": 18,
                                "aqi_ranking": 18,
                                "beat_rate": "95.57%",
                                "data_time": "2023-10-19 20:00:00"
                            }
                        }],
                        "last_update": "2023-10-19 20:58"
                    }
                }
        };
    },
    mounted() {
        this.city = JSON.parse(localStorage.getItem("selectedCity"));
        this.city["population"] = 0;
        this.city["airports"] = [];
        this.city["webs"] = [];
        this.city["prices"] = [];
        this.tickTime();
        //this.getCountry();
        //this.getInfo();
        this.getAirport();
        this.getWebs();
        this.getPrices();
        //this.getWeather();
        //this.initMap();

        const indexes = JSON.parse(localStorage.getItem("indexes"));
        var indexComponents = {};
        indexes.forEach(item => {
            const refName = "result" + item.engName.slice(0, 1).toUpperCase() + item.engName.slice(1, item.engName.length);
            indexComponents[refName] = this.$refs[refName];
            //localStorage.setItem(refName, JSON.stringify(this.$refs[refName]));
        });
        localStorage.setItem("indexComponents", JSON.stringify(indexComponents));
    },
    beforeDestroy() {
        console.log("离开");
        this.map.destroy();
        this.map = null;
    },
    methods: {
        initMap: function() {
            var that = this;

            AMapLoader.load({
                key: localStorage.getItem("gaodeDeveloperKey"),
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
                    center: [this.city.lon, this.city.lat],
                    resizeEnable: true,
                    willReadFrequently: true //消除警告，提升性能
                });
                this.map.addControl(new AMap.Scale()); // 添加左下角的比例尺
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
                this.map.addControl(toolBar); // 添加右下角的放大缩小
                this.map.addControl(controlBar); // 方向盘
                this.map.addControl(new AMap.MapType()); // 添加右上角的标准图和卫星图  和路况
                this.map.addControl(new AMap.HawkEye()); // 添加地图放大镜
            }).catch(e => {
                console.log(e);
            });
        },
        getTime: function() {
            const targetOptions = {
                timeZone: this.city.timezone
            };

            this.currentLocalTime = new Date().toLocaleString({}, targetOptions) + "(" + this.city.time_converter + ")";
        },
        tickTime: function() {
            setInterval(this.getTime, 1000);
        },
        getWeather: function () {
            var that = this;

            getCityWeather("/hour", {
                hours: 24,
                areacode: this.city.areacode
            }).then(res => {
                that.weatherHoursData = res.result.daily_fcsts;
            }, err => {
                console.log(err);
            });

            getCityWeather("/day", {
                days: 15,
                areacode: this.city.areacode
            }).then(res => {
                that.weatherDaysData = res.result.hourly_fcsts;
            }, err => {
                console.log(err);
            });
        },
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
        getInfo: async function() {
            var that = this;

            await getCityGEO("/geo/cities", {
                namePrefix: this.city.name,
                location: this.trimmedCityLocation()
            }).then(res => {
                that.country.code = res.data[0].countryCode;
                that.city["population"] = res.data[0].population;
            }, err => {
                console.log(err);
            });

            setTimeout(async function() {
                await getCityGEO("/locale/currencies", {
                    countryId: that.country.code
                }).then(res => {
                    that.country.currency.code = res.data[0].code;
                    that.country.currency.symbol = res.data[0].symbol;
                }, err => {
                    console.log(err);
                })
            }, 1000);
        },
        getAir: function() {
            var that = this;
            
            getCityAir("/aqi", {
                areacode: this.city.areacode
            }).then(res => {
                console.log(res);
                console.log(JSON.stringify(res));
                that.airRealTimeAqi = res.result.realtimeAqi;
                that.airRealTimePollutant = that.airRealTimeAqi.pollutant;
                delete that.airRealTimeAqi["pollutant"];
            }, err => {
                console.log(err);
            })
        },
        getCountry: function() {
            var that = this;

            getCityCountry("/country/" + this.city.country).then(res => {
                that.country.flag = res[0].flag.officialflag.svg;
            }, err => {
                console.log(err);
            });
        },
        getAirport: function() {
            this.city["airports"] = [{"isActive":true,"AirportName":"All Airports","city":"Beijing","country":"China","AirportCode":"BJS","citycode":null,"lat":"39.904167","long":"116.407222","timzone":"8","cityunicode":"U","zone":"Asia/Shanghai","CountryCode":"CN","id":"61e07352e2f371d6f4906bb7"},{"isActive":true,"AirportName":"Beijing Capital International Airport","city":"Beijing","country":"China","AirportCode":"PEK","citycode":"ZBAA","lat":"40.08010101","long":"116.5849991","timzone":"8","cityunicode":"U","zone":"Asia/Shanghai","CountryCode":"CN","id":"61e0734ee2f371d6f4905f6f"},{"isActive":true,"AirportName":"Beijing Daxing International Airport","city":"Beijing","country":"China","AirportCode":"PKX","citycode":"ZBAD","lat":"39.509945","long":"116.41092","timzone":"8","cityunicode":"U","zone":null,"CountryCode":"CN","id":"61e07353e2f371d6f4906da8"},{"isActive":true,"AirportName":"Beijing Nanyuan Airport","city":"Beijing","country":"China","AirportCode":"NAY","citycode":"ZBNY","lat":"39.78279877","long":"116.3880005","timzone":"8","cityunicode":"U","zone":"Asia/Shanghai","CountryCode":"CN","id":"61e07351e2f371d6f490669c"}];
            // var that = this;

            // getCityAirport("/airports/" + this.city.name, {
            //     page: "1",
            //     limit: "20",
            //     sortBy: 'AirportName:asc'
            // }).then(res => {
            //     that.city["airports"] = res.results;
            // }, err => {
            //     console.log(err);
            // });
        },
        getWebs: function() {
            this.city["webs"] = 
                [
                    {
                    "position": 1,
                    "url": "https://en.wikipedia.org/wiki/Beijing",
                    "title": "Beijing - Wikipedia",
                    "description": "With over 21 million residents, Beijing is the world's most populous national capital city as well as China's second largest city after Shanghai. It is located ..."
                    },
                    {
                    "position": 2,
                    "url": "https://www.nationalgeographic.com/travel/destination/beijing",
                    "title": "Beijing Travel Guide - National Geographic",
                    "description": "National Geographic's latest travel stories about Beijing. ... Beijing. Walk on the Great Wall of China, experience the rich history of an ..."
                    },
                    {
                    "position": 3,
                    "url": "https://www.britannica.com/place/Beijing",
                    "title": "Beijing | Province, City, History, Map, & Facts - Britannica",
                    "description": "Beijing, Wade-Giles romanization Pei-ching, conventional Peking, city, province-level shi (municipality), and capital of the People's Republic of China."
                    },
                    {
                    "position": 4,
                    "url": "https://globalcenters.columbia.edu/content/visiting-beijing",
                    "title": "Visiting Beijing - Cloned | Columbia Global Centers",
                    "description": "Beijing (Chinese: 北京 Běijīng), is the capital of the People's Republic of China. There are very few places in the world where you'll get to check off as ..."
                    },
                    {
                    "position": 5,
                    "url": "https://en.unesco.org/creative-cities/beijing",
                    "title": "Beijing | Creative Cities Network - UNESCO",
                    "description": "Capital of China, Beijing bears witness to a 3,000 years cultural history. Since it joined the Network in 2012, the Creative City of Design has gradually ..."
                    },
                    {
                    "position": 6,
                    "url": "https://www.lonelyplanet.com/china/beijing",
                    "title": "Beijing travel - China, Asia - Lonely Planet",
                    "description": "From ancient walled capital to showpiece megacity in barely a century, Beijing (Běijīng, 北京), spins a breathless yarn of triumph, tragedy, endurance and ..."
                    },
                    {
                    "position": 7,
                    "url": "https://english.beijing.gov.cn/",
                    "title": "The People's Government of Beijing Municipality",
                    "description": "... Beijing as the capital of China to the world ... Beijing Welcomes 718 First Stores of Various Br... Beijing Leads in Moving ..."
                    },
                    {
                    "position": 8,
                    "url": "https://olympics.com/en/olympic-games/beijing-2022",
                    "title": "Beijing 2022 Winter Olympics - Athletes, Medals & Results",
                    "description": "Relive the moments that went down in history at the 2022 winter Olympics in Beijing. Access official videos, results, galleries, sport and athletes."
                    },
                    {
                    "position": 9,
                    "url": "https://www.cnbc.com/beijing/",
                    "title": "Beijing - CNBC",
                    "description": "Putin meets 'dear friend' Xi in Beijing. Here are the top 3 takeaways ... China's economic slowdown: Beijing 'not as alarmed' as many, economist says. Wed ..."
                    },
                    {
                    "position": 10,
                    "url": "https://wikitravel.org/en/Beijing",
                    "title": "Beijing - Wikitravel",
                    "description": "Beijing (北京 Běijīng) is the capital of the People's Republic of China, the most populous country in the world. With a population of 21,500,000 people, it ..."
                    }
                ]

            // var that = this;

            // getCityWebs("/", {
            //     query: this.city.name,
            //     limit: 300,
            //     related_keywords: false
            // }).then(res => {
            //     that.city["webs"] = res.results;
            // }, err => {
            //     console.log(err);
            // });
        },
        getPrices: function() {
            this.city["prices"] = [
                {
                "good_id": 1,
                "item_name": "Price per square meter to Buy Apartment Outside of City Center",
                "category_id": 1,
                "category_name": "Buy Apartment",
                "min": 11165.62,
                "avg": 12725.18,
                "max": 15005.52,
                "usd": {
                    "min": "1604.67",
                    "avg": "1828.80",
                    "max": "2156.52"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 2,
                "item_name": "Price per square meter to Buy Apartment in City Center",
                "category_id": 1,
                "category_name": "Buy Apartment",
                "min": 20007.41,
                "avg": 41252.25,
                "max": 83742.05,
                "usd": {
                    "min": "2875.37",
                    "avg": "5928.58",
                    "max": "12035.01"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 3,
                "item_name": "International Primary School, Yearly for 1 Child",
                "category_id": 2,
                "category_name": "Childcare",
                "min": 36013.28,
                "avg": 40014.75,
                "max": 44016.23,
                "usd": {
                    "min": "5175.66",
                    "avg": "5750.73",
                    "max": "6325.80"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 4,
                "item_name": "Private Preschool or Kindergarten, Monthly for 1 Child",
                "category_id": 2,
                "category_name": "Childcare",
                "min": 1667.27,
                "avg": 1833.97,
                "max": 2000.74,
                "usd": {
                    "min": "239.61",
                    "avg": "263.57",
                    "max": "287.54"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 5,
                "item_name": "Pair of Jeans in a Chain Store Like George, H&M, Zara, etc.",
                "category_id": 3,
                "category_name": "Clothing And Shoes",
                "min": 120.04,
                "avg": 433.48,
                "max": 746.92,
                "usd": {
                    "min": "17.25",
                    "avg": "62.30",
                    "max": "107.34"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 6,
                "item_name": "Pair of Leather Business Shoes",
                "category_id": 3,
                "category_name": "Clothing And Shoes",
                "min": 150.04,
                "avg": 480.21,
                "max": 810.38,
                "usd": {
                    "min": "21.56",
                    "avg": "69.01",
                    "max": "116.46"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 7,
                "item_name": "Pair of Running Shoes, Mid-Range Price",
                "category_id": 3,
                "category_name": "Clothing And Shoes",
                "min": 500.17,
                "avg": 683.27,
                "max": 866.37,
                "usd": {
                    "min": "71.88",
                    "avg": "98.20",
                    "max": "124.51"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 9,
                "item_name": "Apples, 1 kg",
                "category_id": 4,
                "category_name": "Markets",
                "min": 12.6,
                "avg": 14,
                "max": 15.4,
                "usd": {
                    "min": "1.81",
                    "avg": "2.01",
                    "max": "2.21"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 10,
                "item_name": "Banana, 1 kg",
                "category_id": 4,
                "category_name": "Markets",
                "min": 5.42,
                "avg": 6.03,
                "max": 6.64,
                "usd": {
                    "min": "0.78",
                    "avg": "0.87",
                    "max": "0.95"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 11,
                "item_name": "Beef Round or Equivalent Back Leg Red Meat, 1 kg ",
                "category_id": 4,
                "category_name": "Markets",
                "min": 80.05,
                "avg": 90.03,
                "max": 100.01,
                "usd": {
                    "min": "11.50",
                    "avg": "12.94",
                    "max": "14.37"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 12,
                "item_name": "Bottle of Wine, Mid-Range Price",
                "category_id": 4,
                "category_name": "Markets",
                "min": 50.04,
                "avg": 125.03,
                "max": 200.08,
                "usd": {
                    "min": "7.19",
                    "avg": "17.97",
                    "max": "28.75"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 13,
                "item_name": "Chicken Breasts, Boneless and Skinless, 1 kg",
                "category_id": 4,
                "category_name": "Markets",
                "min": 27.03,
                "avg": 38.5,
                "max": 50.04,
                "usd": {
                    "min": "3.88",
                    "avg": "5.53",
                    "max": "7.19"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 14,
                "item_name": "Domestic Beer, 0.5 liter Bottle",
                "category_id": 4,
                "category_name": "Markets",
                "min": 4.02,
                "avg": 7,
                "max": 9.98,
                "usd": {
                    "min": "0.58",
                    "avg": "1.01",
                    "max": "1.43"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 15,
                "item_name": "Eggs, 12 pack",
                "category_id": 4,
                "category_name": "Markets",
                "min": 7.19,
                "avg": 13.09,
                "max": 20.03,
                "usd": {
                    "min": "1.03",
                    "avg": "1.88",
                    "max": "2.88"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 17,
                "item_name": "Lettuce, 1 head",
                "category_id": 4,
                "category_name": "Markets",
                "min": 4.99,
                "avg": 7.52,
                "max": 10.05,
                "usd": {
                    "min": "0.72",
                    "avg": "1.08",
                    "max": "1.44"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 18,
                "item_name": "Loaf of Fresh White Bread, 0.5 kg",
                "category_id": 4,
                "category_name": "Markets",
                "min": 9.98,
                "avg": 13.35,
                "max": 16.72,
                "usd": {
                    "min": "1.43",
                    "avg": "1.92",
                    "max": "2.40"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 19,
                "item_name": "Local Cheese, 1 kg",
                "category_id": 4,
                "category_name": "Markets",
                "min": 63,
                "avg": 70,
                "max": 77,
                "usd": {
                    "min": "9.05",
                    "avg": "10.06",
                    "max": "11.07"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 20,
                "item_name": "Milk, Regular,1 liter",
                "category_id": 4,
                "category_name": "Markets",
                "min": 7.97,
                "avg": 10.69,
                "max": 13.41,
                "usd": {
                    "min": "1.15",
                    "avg": "1.54",
                    "max": "1.93"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 21,
                "item_name": "Onion, 1 kg",
                "category_id": 4,
                "category_name": "Markets",
                "min": 8.98,
                "avg": 9.98,
                "max": 10.98,
                "usd": {
                    "min": "1.29",
                    "avg": "1.43",
                    "max": "1.58"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 22,
                "item_name": "Oranges, 1 kg",
                "category_id": 4,
                "category_name": "Markets",
                "min": 13.03,
                "avg": 21.52,
                "max": 30.01,
                "usd": {
                    "min": "1.87",
                    "avg": "3.09",
                    "max": "4.31"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 23,
                "item_name": "Pack of Cigarettes",
                "category_id": 4,
                "category_name": "Markets",
                "min": 20.03,
                "avg": 23.01,
                "max": 25.99,
                "usd": {
                    "min": "2.88",
                    "avg": "3.31",
                    "max": "3.74"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 24,
                "item_name": "Potato, 1 kg",
                "category_id": 4,
                "category_name": "Markets",
                "min": 5.42,
                "avg": 6.03,
                "max": 6.64,
                "usd": {
                    "min": "0.78",
                    "avg": "0.87",
                    "max": "0.95"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 25,
                "item_name": "White Rice, 1 kg",
                "category_id": 4,
                "category_name": "Markets",
                "min": 6.03,
                "avg": 9.66,
                "max": 15.04,
                "usd": {
                    "min": "0.87",
                    "avg": "1.39",
                    "max": "2.16"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 26,
                "item_name": "Tomato, 1 kg",
                "category_id": 4,
                "category_name": "Markets",
                "min": 5.42,
                "avg": 6.03,
                "max": 6.64,
                "usd": {
                    "min": "0.78",
                    "avg": "0.87",
                    "max": "0.95"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 27,
                "item_name": "Water, 1.5 liter Bottle",
                "category_id": 4,
                "category_name": "Markets",
                "min": 2.98,
                "avg": 4.34,
                "max": 5.7,
                "usd": {
                    "min": "0.43",
                    "avg": "0.62",
                    "max": "0.82"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 28,
                "item_name": "One bedroom apartment outside of city centre",
                "category_id": 5,
                "category_name": "Rent Per Month",
                "min": 1500.57,
                "avg": 1700.65,
                "max": 1900.73,
                "usd": {
                    "min": "215.65",
                    "avg": "244.41",
                    "max": "273.16"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 29,
                "item_name": "One bedroom apartment in city centre",
                "category_id": 5,
                "category_name": "Rent Per Month",
                "min": 2500.91,
                "avg": 2747.85,
                "max": 3241.6,
                "usd": {
                    "min": "359.42",
                    "avg": "394.91",
                    "max": "465.87"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 30,
                "item_name": "Three bedroom apartment outside of city centre",
                "category_id": 5,
                "category_name": "Rent Per Month",
                "min": 2801.06,
                "avg": 3101.15,
                "max": 3501.31,
                "usd": {
                    "min": "402.55",
                    "avg": "445.68",
                    "max": "503.19"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 31,
                "item_name": "Three bedroom apartment in city centre",
                "category_id": 5,
                "category_name": "Rent Per Month",
                "min": 4001.48,
                "avg": 4334.95,
                "max": 5001.82,
                "usd": {
                    "min": "575.07",
                    "avg": "623.00",
                    "max": "718.84"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 32,
                "item_name": "Cappuccino",
                "category_id": 6,
                "category_name": "Restaurants",
                "min": 28,
                "avg": 30.98,
                "max": 35,
                "usd": {
                    "min": "4.02",
                    "avg": "4.45",
                    "max": "5.03"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 33,
                "item_name": "Coca-Cola, 0.33 liter Bottle",
                "category_id": 6,
                "category_name": "Restaurants",
                "min": 2.53,
                "avg": 3.5,
                "max": 4.99,
                "usd": {
                    "min": "0.36",
                    "avg": "0.50",
                    "max": "0.72"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 34,
                "item_name": "Domestic Beer, 0.5 liter Draught",
                "category_id": 6,
                "category_name": "Restaurants",
                "min": 4.99,
                "avg": 9.98,
                "max": 15.04,
                "usd": {
                    "min": "0.72",
                    "avg": "1.43",
                    "max": "2.16"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 35,
                "item_name": "Imported Beer, 0.33 liter Bottle",
                "category_id": 6,
                "category_name": "Restaurants",
                "min": 7.17,
                "avg": 7.97,
                "max": 8.77,
                "usd": {
                    "min": "1.03",
                    "avg": "1.15",
                    "max": "1.26"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 36,
                "item_name": "McMeal at McDonalds or Alternative Combo Meal",
                "category_id": 6,
                "category_name": "Restaurants",
                "min": 31.5,
                "avg": 35,
                "max": 38.5,
                "usd": {
                    "min": "4.53",
                    "avg": "5.03",
                    "max": "5.53"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 37,
                "item_name": "Meal for 2 People, Mid-range Restaurant, Three-course",
                "category_id": 6,
                "category_name": "Restaurants",
                "min": 100.01,
                "avg": 212.07,
                "max": 500.17,
                "usd": {
                    "min": "14.37",
                    "avg": "30.48",
                    "max": "71.88"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 38,
                "item_name": "Meal in Inexpensive Restaurant",
                "category_id": 6,
                "category_name": "Restaurants",
                "min": 15.04,
                "avg": 17.5,
                "max": 20.03,
                "usd": {
                    "min": "2.16",
                    "avg": "2.52",
                    "max": "2.88"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 40,
                "item_name": "Average Monthly Net Salary, After Tax",
                "category_id": 7,
                "category_name": "Salaries And Financing",
                "min": 6902.55,
                "avg": 7669.5,
                "max": 8436.45,
                "usd": {
                    "min": "992.00",
                    "avg": "1102.22",
                    "max": "1212.45"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 42,
                "item_name": "Cinema ticket, 1 Seat",
                "category_id": 8,
                "category_name": "Sports And Leisure",
                "min": 31.5,
                "avg": 35,
                "max": 38.5,
                "usd": {
                    "min": "4.53",
                    "avg": "5.03",
                    "max": "5.53"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 43,
                "item_name": "Fitness Club, Monthly Fee for 1 Adult",
                "category_id": 8,
                "category_name": "Sports And Leisure",
                "min": 166.7,
                "avg": 183.42,
                "max": 200.14,
                "usd": {
                    "min": "23.96",
                    "avg": "26.36",
                    "max": "28.76"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 44,
                "item_name": "Tennis Court Rent, 1 Hour on Weekend",
                "category_id": 8,
                "category_name": "Sports And Leisure",
                "min": 50.04,
                "avg": 100.01,
                "max": 150.04,
                "usd": {
                    "min": "7.19",
                    "avg": "14.37",
                    "max": "21.56"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 45,
                "item_name": "Gasoline, 1 liter",
                "category_id": 9,
                "category_name": "Transportation",
                "min": 7,
                "avg": 7.78,
                "max": 8.81,
                "usd": {
                    "min": "1.01",
                    "avg": "1.12",
                    "max": "1.27"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 46,
                "item_name": "Monthly Pass, Regular Price",
                "category_id": 9,
                "category_name": "Transportation",
                "min": 135.04,
                "avg": 150.04,
                "max": 165.05,
                "usd": {
                    "min": "19.41",
                    "avg": "21.56",
                    "max": "23.72"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 47,
                "item_name": "One-way Ticket, Local Transport",
                "category_id": 9,
                "category_name": "Transportation",
                "min": 1.81,
                "avg": 2.01,
                "max": 2.21,
                "usd": {
                    "min": "0.26",
                    "avg": "0.29",
                    "max": "0.32"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 48,
                "item_name": "Taxi, price for 1 hour Waiting, Normal Tariff",
                "category_id": 9,
                "category_name": "Transportation",
                "min": 30.01,
                "avg": 50.04,
                "max": 70.07,
                "usd": {
                    "min": "4.31",
                    "avg": "7.19",
                    "max": "10.07"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 49,
                "item_name": "Taxi, price for 1 km, Normal Tariff",
                "category_id": 9,
                "category_name": "Transportation",
                "min": 2.2,
                "avg": 2.53,
                "max": 2.98,
                "usd": {
                    "min": "0.32",
                    "avg": "0.36",
                    "max": "0.43"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 50,
                "item_name": "Taxi Start, Normal Tariff",
                "category_id": 9,
                "category_name": "Transportation",
                "min": 8.11,
                "avg": 9.01,
                "max": 9.91,
                "usd": {
                    "min": "1.17",
                    "avg": "1.29",
                    "max": "1.42"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 52,
                "item_name": "Volkswagen Golf 1.4 90 KW Trendline (Or Equivalent New Car)",
                "category_id": 9,
                "category_name": "Transportation",
                "min": 250092.23,
                "avg": 315116.22,
                "max": 380140.21,
                "usd": {
                    "min": "35942.05",
                    "avg": "45286.99",
                    "max": "54631.93"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 53,
                "item_name": "Prepaid Mobile Tariff Local, price per 1 min, No Discounts or Plans",
                "category_id": 10,
                "category_name": "Utilities Per Month",
                "min": 0.12,
                "avg": 0.13,
                "max": 0.14,
                "usd": {
                    "min": "0.02",
                    "avg": "0.02",
                    "max": "0.02"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 54,
                "item_name": "Basic utilities for 85 square meter Apartment including Electricity, Heating or Cooling, Water and Garbage",
                "category_id": 10,
                "category_name": "Utilities Per Month",
                "min": 85.04,
                "avg": 421.81,
                "max": 758.58,
                "usd": {
                    "min": "12.22",
                    "avg": "60.62",
                    "max": "109.02"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 55,
                "item_name": "Internet, 60 Mbps or More, Unlimited Data, Cable/ADSL",
                "category_id": 10,
                "category_name": "Utilities Per Month",
                "min": 30.01,
                "avg": 80.05,
                "max": 130.09,
                "usd": {
                    "min": "4.31",
                    "avg": "11.50",
                    "max": "18.70"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 58,
                "item_name": "Water, 0.33 liter Bottle",
                "category_id": 4,
                "category_name": "Markets",
                "min": 2.01,
                "avg": 2.33,
                "max": 2.98,
                "usd": {
                    "min": "0.29",
                    "avg": "0.33",
                    "max": "0.43"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 64,
                "item_name": "Summer Dress in a Chain Store Like George, H&M, Zara, etc.",
                "category_id": 3,
                "category_name": "Clothing And Shoes",
                "min": 199.04,
                "avg": 283.11,
                "max": 450.2,
                "usd": {
                    "min": "28.61",
                    "avg": "40.69",
                    "max": "64.70"
                },
                "measure": "money",
                "currency_code": "CNY"
                },
                {
                "good_id": 65,
                "item_name": "Mortgage Interest Rate in Percentages for 20 Years Fixed-Rate, Yearly, Fixed-Rate",
                "category_id": 7,
                "category_name": "Salaries And Financing",
                "min": 3.87,
                "avg": 4.3,
                "max": 4.73,
                "measure": "percent"
                },
                {
                "good_id": 68,
                "item_name": "Imported Beer, 0.33 liter Bottle",
                "category_id": 4,
                "category_name": "Markets",
                "min": 4.49,
                "avg": 4.99,
                "max": 5.49,
                "usd": {
                    "min": "0.65",
                    "avg": "0.72",
                    "max": "0.79"
                },
                "measure": "money",
                "currency_code": "CNY"
                }
            ];
            
            // var that = this;

            // getCityPrices("/prices", {
            //     city_name: this.city.name,
            //     country_name: this.city.country
            // }).then(res => {
            //     that.city["prices"] = res.prices;
            // }, err => {
            //     console.log(err);
            // });
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
    height: 88%;
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
    height: 88%;
}
.result-info-container ul {
    margin: 0;
    list-style-type: square;
}
.result-info-container li {
    padding-top: 30px;
    font-size: 22px;
}
.result-info-container img {
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
    height: 300px;
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
    height: 225px;
}
:deep(.result-airports-container .el-table td) {
    padding-top: 15px;
    font-size: 19px;
    padding-bottom: 15px;
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