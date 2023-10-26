import router from './router/index.js';
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import './axios/tokens.js';  //预先存入tokens

const app = createApp(App);
app.use(router);       //使用router
app.use(ElementPlus);  //使用element-plus
app.mount('#app');     //挂载vue3应用

//全局注册element-plus所有组件
for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
    if (!app.component(name)) {
        app.component(name, component);
    }
}