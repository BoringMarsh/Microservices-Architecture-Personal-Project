<template>
    <!-- 自定义组件：导航栏按钮 -->
    <span class="button" :style="getBackgroundColor">
        <!-- 图标 -->
        <img :src="src" alt="image src invalid">  
        <!-- 文字 -->
        <label> {{ detailName }} </label>
    </span>
    
</template>

<script>
export default {
    name: "detailIndexButton",
    props: {
        src: String,         //图标url
        detailName: String,  //文字
        color: String        //背景颜色
    },
    data() {
        return {

        }
    },
    methods: {
        //动态获取按键样式
        getBackgroundColor: function() {
            return {
                backgroundColor: this.color
            }
        }
    }
}
</script>

<style scoped>
.button {
    position: relative;
    top: 15%;
    display: inline-block;
    margin-left: 1%;
    height: 70%;
    width: 8%;
    border-radius: 5px;
}
.button:hover {
    background-color: #00000050;
}
.button > img {
    position: relative;
    top: 18%;
    left: 8%;
    width: 20%;
}
.button > label {
    position: relative;
    top: 6%;
    left: 12%;
    font-size: larger;
    font-weight: lighter;
}
</style>