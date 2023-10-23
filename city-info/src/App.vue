<template>
    <div class="container">
        <div class="background">
            <!-- 白天的顶部背景 -->
            <div v-if="(currentHour >= 6 && currentHour < 18)" class="background-day-top">
                <img
                    v-for="num in 16"
                    src="./assets/cloud.svg"
                    class="background-day"
                    :style="
                        'left: ' + (dayStartLeft + (num - 1) * 6).toString() + '%;' +
                        'top: ' + (dayLevel + ((num - 1) % 2 == 0 ? -1 : 1) * dayDeviation).toString() + '%;' +
                        'opacity: ' + (num == 3 || cloudToWindIndexes.includes(num) ? '0%;' : '50%;')
                    "
                >
                <img
                    v-for="num in 16"
                    src="./assets/wind.svg"
                    class="background-day"
                    :style="
                        'left: ' + (dayStartLeft + (num - 1) * 6).toString() + '%;' +
                        'top: ' + (dayLevel + ((num - 1) % 2 == 0 ? -1 : 1) * dayDeviation).toString() + '%;' +
                        'opacity: ' + (num == 3 || !cloudToWindIndexes.includes(num) ? '0%;' : '50%;')
                    "
                >
                <img src="./assets/sun.svg" class="background-sun">
            </div>

            <!-- 晚上的顶部背景 -->
            <div v-else class="background-night-top">
                <img
                    v-for="num in 16"
                    src="./assets/star.svg"
                    class="background-night"
                    :style="
                        'left: ' + (nightStartLeft + (num - 1) * 6).toString() + '%;' +
                        'top: ' + (nightLevel + ((num - 1) % 2 == 0 ? -1 : 1) * nightDeviation).toString() + '%;' +
                        'opacity: ' + (num == 5 || starToCloudIndexes.includes(num) ? '0%' : '100%;')
                    "
                >
                <img
                    v-for="num in 16"
                    src="./assets/cloud.svg"
                    class="background-night"
                    :style="
                        'left: ' + (nightStartLeft + (num - 1) * 6).toString() + '%;' +
                        'top: ' + (nightLevel + ((num - 1) % 2 == 0 ? -1 : 1) * nightDeviation).toString() + '%;' +
                        'opacity: ' + (num == 5 || !starToCloudIndexes.includes(num) ? '0%' : '50%;')
                    "
                >
                <img src="./assets/moon.svg" class="background-moon">
            </div>
            
            <img
                v-for="num in 11"
                src="./assets/city.svg"
                class="background-city"
                :style="'left: ' + (cityStartLeft + (num - 1) * 8.6).toString() + '%;'"
            >
            <img src="./assets/satellite.svg" class="background-satellite">
            <img src="./assets/questionMark.svg" class="background-question-mark">
            <img src="./assets/doubleArrow.svg" class="background-double-arrow">
            <img src="./assets/radar.svg" class="background-radar">
            <img src="./assets/singleArrow.svg" class="background-single-arrow">
            <img src="./assets/network.svg" class="background-network">
            <img src="./assets/magnifier.svg" class="background-magnifier">
        </div>

        <div class="content">
            <router-view></router-view>
        </div>

        <div :style="getToolBarStyle()" class="tool-bar">
            <img v-for="(value, key, index) in toolBarImages" :src="require('./assets/' + key + '.svg')" :title="key" :style="getToolBarImgsStyle(index)">
            <span v-if="ifCityNameShow" class="city-name"> 当前城市：{{ cityName }} </span>
            <detail-index-button
                v-if="ifCityNameShow"
                :src="require('./assets/index.svg')"
                :detail-name="'导航栏'"
                class="index-button"
                @mouseenter="ifMouseInIndexButton = true;"
                @mouseleave="ifMouseInIndexButton = false;"
            ></detail-index-button>
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
                    :src="require('./assets/citiesNotFound.svg')"
                    :detail-name="item.name"
                    :style="getIndexButtonStyle(index, item.color, item.themeColor)"
                    @click="scrollToContainers(item.engName)"
                ></detail-index-button>
            </div>

            <button @click="getRecord"> getRecord </button>
        </div>
    </div>
    
</template>

<script>
import detailIndexButton from './components/detailIndexButton.vue';
import { getSearchRecord } from './axios/backendAPI/searchRecord';

export default {
    data() {
        return {
            currentHour: -1,

            dayStartLeft: 3,
            dayLevel: 8,
            dayDeviation: 1.5,
            cloudToWindCount: 5,
            cloudToWindIndexes: [],

            nightStartLeft: 2.5,
            nightLevel: 8,
            nightDeviation: 1.5,
            starToCloudCount: 8,
            starToCloudIndexes: [],

            cityStartLeft: 0,
            ifToolBarBackgroundShow: false,
            ifMouseInIndexButton: false,
            ifMouseInIndexList: false,
            cityName: "",
            ifCityNameShow: false,

            toolBarImages: {
                "info": "关于",
                "options": "设置",
                "home": "主页"
            },
            
            indexes: [
                { name: "详细位置", engName: "position", color: "black", themeColor: "#F9F871", hover: false },
                { name: "城市地图", engName: "map", color: "white", themeColor: "#196883", hover: false },
                { name: "地区信息", engName: "info", color: "white", themeColor: "#324157", hover: false },
                { name: "城市空气", engName: "air", color: "white", themeColor: "#007060", hover: false },
                { name: "城市天气", engName: "weather", color: "white", themeColor: "#E1A0C2", hover: false },
                { name: "机场", engName: "airport", color: "white", themeColor: "#386E97", hover: false },
                { name: "相关网页", engName: "webs", color: "white", themeColor: "#8251c6", hover: false },
                { name: "物价信息", engName: "prices", color: "white", themeColor: "#db57db", hover: false }
            ]
        }
    },
    mounted() {
        while (this.starToCloudIndexes.length < this.starToCloudCount) {
            const randNum = Math.floor(Math.random() * 16 + 1);

            if (!this.starToCloudIndexes.includes(randNum) && randNum != 5) {
                this.starToCloudIndexes.push(randNum);
            }
        }

        while (this.cloudToWindIndexes.length < this.cloudToWindCount) {
            const randNum = Math.floor(Math.random() * 9 + 1);

            if (!this.cloudToWindIndexes.includes(randNum) && randNum != 3) {
                this.cloudToWindIndexes.push(randNum);
            }
        }

        this.currentHour = new Date().getHours();
        localStorage.setItem("indexes", JSON.stringify(this.indexes));
    },
    methods: {
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
        getToolBarImgsStyle: function(index) {
            return {
                "right": (index * 4 + 2).toString() + "%"
            }
        },
        getIndexButtonStyle: function(index, color, themeColor) {
            return {
                color: color,
                backgroundColor: this.indexes[index].hover ? themeColor + "90" : themeColor
            }
        },
        scrollToContainers: function(name) {
            const refName = "result" + name.slice(0, 1).toUpperCase() + name.slice(1, name.length);
            const indexComponents = JSON.parse(localStorage.getItem("indexComponents"));
            const targetComponent = indexComponents[refName];
            console.log(indexComponents);
            console.log(targetComponent);
            //targetComponent.scrollIntoView({ behavior: "smooth" })
        },
        getRecord: function() {
            var that = this;

            getSearchRecord("/record/").then(res => {
                console.log(res);
            }, err => {
                console.log(res);
            });
        }
    },
    watch: {
        $route: function(to, from) {
            this.ifToolBarBackgroundShow = (to.path.includes("/city-input/city-detail"));
            this.ifCityNameShow = (to.path.includes("/city-input/city-detail"));

            if (to.path.includes("/city-input/city-detail")) {
                this.cityName = JSON.parse(localStorage.getItem("selectedCity")).name;
            }
        }
    },
    components: {
        "detail-index-button": detailIndexButton
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
    overflow-y: scroll;
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
</style>
