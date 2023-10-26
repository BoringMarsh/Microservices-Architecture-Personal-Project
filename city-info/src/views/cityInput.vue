<template>
    <div v-if="showRouteFromView" class="city-input">
        <!-- 输入页面头部 -->
        <div class="input-header">
            <h1> Hello city-input! </h1>
            <p> 了解一座城市，从输入它的名字开始 </p>
        </div>
        
        <!-- 输入区域，关键词不为空搜索按钮出现，否则仅有提示信息 -->
        <div class="input-container">
            <el-input v-model="searchKeyword" @input="checkSearchKeyword" placeholder="输入城市名" class="input-input"></el-input>
            <div style="height: 20px;"></div>
            
            <router-link v-if="ifKeywordPassed" :to="'/city-input/city-search-result/' + searchKeyword" #default="slot" custom>
                <el-button @click="showSearchResult(); slot.navigate()" class="input-button"> 开始世界之旅 </el-button>
            </router-link>
            
            <p v-else class="keyword-error-message"> {{ keywordErrorMessage }} </p>
        </div>

        <!-- 输入页面底部 -->
        <div class="input-footer">
            <div class="section">
                <h2> 即将展示在眼前的 </h2>
                <ul>
                    <li> 来自各大信息提供者接口的调用 </li>
                    <li> 精心挑选过的城市信息 </li>
                </ul>
            </div>
            <div class="section">
                <h2> 您可以做的 </h2>
                <p> 输入城市名，选择一个搜索结果，足不出户了解一座城市！ </p>
            </div>
        </div>
    </div>

    <!-- 路由匹配组件 -->
    <router-view></router-view>
</template>

<script>
import { ElInput, ElButton } from 'element-plus';

export default {
    data() {
        return {
            showRouteFromView: true,  //是否展示本组件（路由切换时，作为RouteFrom组件用）
            searchKeyword: "",        //搜索关键词
            ifKeywordPassed: false,   //关键词是否通过检查
            keywordErrorMessage: "请输入关键词"  //提示信息
        }
    },
    methods: {
        //检查输入的关键词是否合法（不为空即通过）
        checkSearchKeyword: function() {
            this.ifKeywordPassed = false;

            if (!this.searchKeyword) {
                this.keywordErrorMessage = "关键词不能为空";
                return;
            }

            this.ifKeywordPassed = true;
        },
        //展示搜索结果前置工作：将关键词存入本地存储，以便其他组件取用
        showSearchResult: function() {
            localStorage.setItem("keyword", this.searchKeyword);
        }
    },
    watch: {
        //监视路由，转到当前组件对应的路径时显示当前组件
        $route: function(to, from) {
            this.showRouteFromView = (to.path == "/city-input");
        }
    },
    components: {
        "el-input": ElInput,
        "el-button": ElButton
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
    margin-bottom: 30px;
}
:deep(.el-input) {
    --el-input-border-color: rgb(212, 212, 212);
    --el-input-hover-border-color: #324157;
    --el-input-focus-border-color: #196883;
    --el-input-placeholder-color: #757575;
}
:deep(.el-input__wrapper) {
    border: 2px solid #324157;
    border-radius: 15px;
    background-color: rgb(255, 255, 255, 0.5);
    height: 40px;
    padding-left: 20px;
}
:deep(.el-input__wrapper.is-focus) {
    border: 2px solid #196883;
}
:deep(.el-input__inner) {
    font-size: x-large;
    color: #196883;
}
.input-input {
    width: 20%;
}
:deep(.el-button) {
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