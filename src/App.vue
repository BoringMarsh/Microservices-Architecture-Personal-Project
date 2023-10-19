<template>
    <div class="container">
        <div class="background">
            <div v-if="currentHour >= 6 && currentHour < 18" class="background-day-top">
                <img
                    v-for="num in 9"
                    src="./assets/cloud.svg"
                    class="background-cloud"
                    :style="
                        'left: ' + (cloudStartLeft + (num - 1) * 10).toString() + '%;' +
                        'top: ' + (cloudLevel + ((num - 1) % 2 == 0 ? -1 : 1) * cloudDeviation).toString() + '%;' +
                        'opacity: ' + (num == 3 ? '0%;' : '30%;')
                    "
                >
                <img src="./assets/sun.svg" class="background-sun">
            </div>
            <img
                v-else
                v-for="num in 16"
                src="./assets/star.svg"
                class="background-star"
                :style="
                    'left: ' + (starStartLeft + (num - 1) * 6).toString() + '%;' +
                    'top: ' + (starLevel + ((num - 1) % 2 == 0 ? -1 : 1) * starDeviation).toString() + '%;'
                "
            >
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
        </div>

        <div class="content">
            <router-view></router-view>
        </div>
    </div>
    
</template>

<script>
export default {
    data() {
        return {
            currentHour: -1,
            cloudStartLeft: 3,
            cloudLevel: 3,
            cloudDeviation: 1.5,
            starStartLeft: 2.5,
            starLevel: 7,
            starDeviation: 3,
            cityStartLeft: 0
        }
    },
    mounted() {
        this.currentHour = new Date().getHours();
        console.log(this.currentHour);
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
    background-color: rgb(219, 238, 255);
    top: 0%;
    left: 0%;
    z-index: 1;
}
.background-cloud {
    position: fixed;
    opacity: 30%;
    width: 13.4%;
    height: 16.6%;
}
.background-sun {
    position: fixed;
    opacity: 70%;
    width: 13.4%;
    height: 16.6%;
    top: 2%;
    left: 23%;
}
.background-star {
    position: fixed;
    opacity: 30%;
    width: 4%;
    height: 6%;
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
    opacity: 70%;
    width: 16%;
    height: 18%;
    top: 25%;
    left: 10%;
}
.background-question-mark {
    position: fixed;
    opacity: 30%;
    width: 8%;
    height: 10%;
    top: 25%;
    right: 33%;
    transform: rotate(45deg);
}
.background-double-arrow {
    position: fixed;
    opacity: 30%;
    width: 25%;
    height: 25%;
    transform: rotate(-90deg);
    bottom: 30%;
    left: 6%;
}
.background-radar {
    position: fixed;
    opacity: 70%;
    width: 13%;
    height: 16%;
    bottom: 25%;
    right: 25%;
}
.background-single-arrow {
    position: fixed;
    opacity: 70%;
    width: 15%;
    height: 15%;
    bottom: 40%;
    right: 16%;
}
.background-network {
    position: fixed;
    opacity: 70%;
    width: 13%;
    height: 16%;
    bottom: 55%;
    right: 8%;
}
</style>
