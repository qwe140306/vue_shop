<template>
    <div>
        <!-- 头部面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }"
                >首页
            </el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片内容视图 -->
        <el-card class="box-card">
            <el-table :data="rightList" style="width: 100%" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName">
                </el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.level === '0'">一级权限</el-tag>
                        <el-tag type="success" v-show="scope.row.level === '1'">二级权限</el-tag>
                        <el-tag type="warning" v-show="scope.row.level === '2'">三级权限</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'rights',
        data() {
            return {
                // 保存请求权限列表数据
                rightList: []
            };
        },
        created() {
            this.getRightList();
        },
        methods: {
            getRightList() {
                this.axios
                    .get(`/rights/list`)
                    .then(res => {
                        this.rightList = res.data.data.sort((p1, p2) => {
                            return p1.level - p2.level;
                        });
                    })
                    .catch(err => {
                        this.$message.success(
                            '请求数据失败，请稍后重试！' + err
                        );
                    });
            }
        }
    };
</script>

<style lang="less" scoped>
    .el-table {
        margin-top: 0;
    }
</style>
