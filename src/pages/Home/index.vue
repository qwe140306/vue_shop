<template>
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="./heima.png" alt="" />
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout" ref="btn">
                退出登录
            </el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区域 -->
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409bff"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    router
                    :default-active="activePath"
                >
                    <!-- 一级菜单 -->
                    <el-submenu
                        :index="item.id + ''"
                        v-for="item in mennlist"
                        :key="item.id"
                    >
                        <!-- 一级菜单模板 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i class="iconfont" :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{ item.authName }}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item
                            :index="subItem.path"
                            v-for="subItem in item.children"
                            :key="subItem.id"
                        >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ subItem.authName }}</span>
                            </template></el-menu-item
                        >
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容区 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            mennlist: [],
            iconsObj: {
                '125': 'icon-users',
                '103': 'icon-tijikongjian',
                '101': 'icon-shangpin',
                '102': 'icon-danju',
                '145': 'icon-baobiao'
            },
            // 是否折叠侧边栏
            isCollapse: false,
            // 保存激活状态的链接地址
            activePath: ''
        };
    },
    methods: {
        // 退出登录
        logout() {
            this.$confirm('是否退出登录?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            })
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '退出成功!'
                    });
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('activePath');
                    this.$router.replace('/login');
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
        },
        // 获取所有的菜单
        getMenuList() {
            this.axios.get('/menus').then(res => {
                if (res.status !== 200) return this.res.data.meta.msg;
                this.mennlist = res.data.data;
            });
        },
        // 点击折叠侧边栏菜单
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        }
    },
    watch: {
        '$route.name': {
            immediate: true,
            handler(val) {
                sessionStorage.setItem('activePath', val.toLowerCase());
                this.activePath = sessionStorage.getItem('activePath');
            }
        }
    },
    created() {
        this.getMenuList();
    },
    mounted() {
        this.activePath = sessionStorage.getItem('activePath');
    }
};
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
    button {
        margin-right: 10px;
        padding: 12px;
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color: #4a5064;
    line-height: 24px;
    font-size: 10px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
