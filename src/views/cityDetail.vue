<template>
    <div class="city-detail">
        <div class="result-header">
            <p> 正在显示城市：{{ city.name }} </p>

            <div>
                <p> {{ city.path }} </p>
                <p> {{ currentLocalTime }} </p>
            </div>
        </div>

        <div class="flex-container">
            <div class="result-map-container">
                <p> 城市地图：From Gaode </p>
                <!-- <div id="gaode-map"></div> -->
            </div>

            <div class="result-info-container">
                <p> 其余信息：From Rapid API </p>

                <div>
                    <ul>
                        <li> 人口：{{ city.population }} </li>
                        <li> 货币：{{ country.currency.code + "(" + country.currency.symbol + ")" }} </li>
                        <li> 经纬度：{{ city.lon + ", " + city.lat }} </li>
                        <li> 国旗：<img :src="country.flag"> </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="flex-container">
            <div class="result-air-container">
                <p> 城市空气：From APISpace </p>
                <label> 实时情况： </label>
                <div class="result-air-cards">
                    <label v-for="(value, key) in airRealTimeAqi" :key="key">
                        <label style="font-size: larger; height: 60px;"> {{ key }} </label>
                        <hr>
                        <label style="font-size: larger;"> {{ value }} </label>
                    </label>
                </div>
                
                <label> 实时排行：{{ airRealTimeRanks.result.realtimeRanks[0].hourlyRanking.aqi_ranking }} </label>
                <label> 打败了{{ airRealTimeRanks.result.realtimeRanks[0].hourlyRanking.beat_rate }}的城市 </label>
            </div>

            <div class="result-weather-container">
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

        <div class="result-airports-container">
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
                <el-table-column label="代码" align="center" width="150">
                    <template #default="scope">
                        <label class="airports-row-AirportCode"> {{ scope.row.AirportCode }} </label>
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
        this.city["airports"] = [];
        this.city["population"] = 0;
        this.tickTime();
        this.getCountry();
        this.getInfo();
        this.getAirport();
        //this.getWeather();
        //this.initMap();
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
        }
    },
    watch: {
        $route: function (to, from) {
            console.log(to);
        }
    }
}
</script>
 
<style scoped>
.city-detail {
    z-index: 9999;
}
.result-header {
    margin-left: 2%;
    margin-top: 2%;
    margin-bottom: 2%;
    text-align: center;
    width: 95%;
    height: 20%;
    background-color: #F9F87190;
    border: 10px solid #F9F87190;
    border-radius: 5px;
}
.result-header > p {
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
.result-header > div > p {
    font-size: larger;
    font-weight: lighter;
    color: black;
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
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: larger;
    font-weight: lighter;
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
.result-air-container p {
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
.result-air-cards > label {
    float: left;
    margin-left: 3%;
    margin-bottom: 4%;
    width: 20%;
    height: 120px;
    background-color: #C5FCEE;
    border: 5px solid white;
    border-radius: 10px;
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
::v-deep .el-radio-button {
    --el-radio-button-checked-border-color: #FFC288;
}
::v-deep .el-radio-button .el-radio-button__inner {
    color: #464646;
    font-size: large;
}
::v-deep .el-radio-button .el-radio-button__inner:hover {
    color: #E1A0C2;
}
::v-deep .el-radio-button.is-active .el-radio-button__inner {
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
::v-deep .el-table td {
    padding-top: 15px;
    font-size: 16px;
    padding-bottom: 15px;
    background-color: #F9F87130;
}
::v-deep .el-table td,.building-top .el-table th.is-leaf {
    border-bottom: 4px solid #E1A0C2;
}
.result-airports-container {
    width: 35%;
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