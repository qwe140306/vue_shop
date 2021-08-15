import Vue from 'vue';
import VueRouter from 'vue-router';
// 登录路由组件
import Login from '../pages/Login';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        // 跟路由,重定向到 login组件 redirect 重定向
        { path: '/', redirect: '/login' },
        {
            name: 'login',
            path: '/login',
            component: Login,
            // 独享路由守卫
            beforeEnter(to, from, next) {
                if (sessionStorage.getItem('token')) {
                    console.log('当前存在token跳转到Home路由组件');
                    next({ name: 'Home' });
                } else {
                    console.log('当前不存在token 继续运行');
                    next();
                }
            }
        },
        {
            name: 'Home',
            path: '/Home',
            component: Home,
            // 独享路由守卫
            beforeEnter(to, from, next) {
                if (sessionStorage.getItem('token')) {
                    console.log('当前存在token可以访问Home组件');
                    next();
                } else {
                    console.log('当前不存在token 不能访问 home组件');
                    next({ name: 'login' });
                }
            }
        },
        {
            path: '/NotFound',
            component: NotFound
        },
        {
            path: '*',
            component: NotFound
        }
    ]
});

// 挂载路由导航守卫

export default router;
