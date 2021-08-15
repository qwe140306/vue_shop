import Vue from 'vue';
import App from './App.vue';
import router from './router';
// 引入全局样式表
import './assets/css/index.css';

// 按需引入  按需全局注册
import {
    Button,
    Input,
    Form,
    FormItem,
    Message,
    Link,
    MessageBox
} from 'element-ui';
Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Link);
Vue.prototype.$message = Message;
// MessageBox 有四个 MessageBox, MessageBox.alert, MessageBox.confirm 和 MessageBox.prompt
Vue.prototype.$confirm = MessageBox.confirm;

// 引入axios
import axios from 'axios';
// 配置默认请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1';
Vue.prototype.axios = axios;

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
