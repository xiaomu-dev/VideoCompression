// 导入 CSS 重置样式
import('normalize.css');

// 导入项目全局样式
import('@/styles/index.scss');

import { createApp } from 'vue';
import App from './App.vue';
const app = createApp(App);

import router from './router';
app.use(router);

import { createPinia } from 'pinia';
app.use(createPinia());

// import ElementPlus from 'element-plus';
// app.use(ElementPlus, { size: 'small', zIndex: 3000 });

app.mount('#app');
