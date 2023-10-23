import router from './router/index.js';
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import './axios/tokens.js';

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount('#app');

for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
    if (!app.component(name)) {
        app.component(name, component);
    }
}