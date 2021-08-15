<template>
    <div>
        <el-button type="info" @click="logout" ref="btn">退出登录</el-button>
    </div>
</template>

<script>
export default {
    name: 'Home',
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
                    this.$router.replace('/login');
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
        }
    }
};
</script>

<style lang="less" scoped></style>
