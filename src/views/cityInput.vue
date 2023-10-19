<template>
    <div v-if="showRouteFromView" class="city-input">
        <div class="input-header">
            <h1> Hello city-input! </h1>
            <p> 了解一座城市，从输入它的名字开始 </p>
        </div>
        
        <div class="input-container">
            <el-input v-model="searchKeyword" @input="checkSearchKeyword" placeholder="输入城市名" class="input-input"></el-input>
            <div style="height: 20px;"></div>
            
            <router-link v-if="ifKeywordPassed" :to="'/city-input/city-search-result/' + searchKeyword" #default="slot" custom>
                <el-button @click="showSearchResult(); slot.navigate()" class="input-button"> 开始世界之旅 </el-button>
            </router-link>
            
            <p v-else class="keyword-error-message"> {{ keywordErrorMessage }} </p>
        </div>

        <div class="input-footer">
            <div class="section">
                <h2> 即将展示在眼前的 </h2>
                <ul>
                    <li> 来自各大信息提供者接口的调用 </li>
                    <li> 精心挑选过的城市信息 </li>
                </ul>
            </div>
            <div class="section">
                <h2> 作者 </h2>
                <p> 2151294马威 </p>
            </div>
        </div>
    </div>

    <router-view></router-view>
</template>

<script>
import { watch } from 'vue';

export default {
    data() {
        return {
            showRouteFromView: true,
            searchKeyword: "",
            ifKeywordPassed: false,
            keywordErrorMessage: "请输入关键词"
        }
    },
    methods: {
        checkSearchKeyword: function() {
            this.ifKeywordPassed = false;

            if (!this.searchKeyword) {
                this.keywordErrorMessage = "关键词不能为空";
                return;
            }

            this.ifKeywordPassed = true;
        },
        showSearchResult: function() {
            localStorage.setItem("keyword", this.searchKeyword);
        }
    },
    watch: {
        $route: function(to, from) {
            this.showRouteFromView = (to.path == "/city-input");
        }
    }
}
</script>

<style scoped>
.city-input {
    text-align: center;
}
.input-header {
    padding-top: 150px;
}
.input-header h1 {
    color: #196883;
}
.input-container {
    margin-top: 60px;
    margin-bottom: 60px;
}
::v-deep .el-input {
    --el-input-border-color: rgb(212, 212, 212);
    --el-input-hover-border-color: #324157;
    --el-input-focus-border-color: #196883;
    --el-input-placeholder-color: #757575;
}
::v-deep .el-input__wrapper {
    border: 2px solid #324157;
    border-radius: 15px;
    background-color: rgb(255, 255, 255, 0.5);
    height: 40px;
    padding-left: 20px;
}
::v-deep .el-input__wrapper.is-focus {
    border: 2px solid #196883;
}
::v-deep .el-input__inner {
    font-size: x-large;
    color: #196883;
}
.input-input {
    width: 20%;
}
::v-deep .el-button {
    color: white;
    font-size: large;
    font-weight: lighter;
}
.input-button {
    width: 200px;
    height: 50px;
    border: 2px solid white;
    border-radius: 20px;
    background-color: #196883;
}
.input-button:hover {
    background-color: #2aba98;
    box-shadow: 0 1em 1em -1em #0e3d26;
}
.section {
    margin-top: 30px;
    margin-bottom: 30px;
}
.section h2 {
    color: #196883;
}
ul {
    list-style-type: none;
    padding: 0;
}
ul li {
    margin-bottom: 5px;
}
.keyword-error-message {
    margin: 0;
    color: #592525;
    font-size: x-large;
    height: 50px;
}
</style>