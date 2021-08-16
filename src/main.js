import Vue from 'vue';
import App from './App.vue';
import router from './router';
// 引入全局样式表
import './assets/css/index.css';

// element ui 文件
import './plugins/element'



// 引入axios
import axios from 'axios';
// 配置默认请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1';
axios.interceptors.request.use(config => {
    config.headers.Authorization = sessionStorage.getItem('token');
    return config;
});
Vue.prototype.axios = axios;

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
