<template>
    <div class="main">
        <!-- 头部面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">
                首页
            </el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card :body-style="{ padding: '20px' }" shadow="always">
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button
                        v-loading.fullscreen.lock="loading"
                        element-loading-background="rgba(0, 0, 0, 0.1)"
                        element-loading-spinner="el-icon-loading"
                        element-loading-text="拼命加载中"
                        type="primary"
                        @click="showaddDialog"
                        >添加角色
                    </el-button>
                </el-col>
            </el-row>
            <!-- 当前角色列表 -->
            <el-table :data="roleList" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row
                            v-for="(item1, index1) in scope.row.children"
                            :key="item1.id"
                            :class="[
                                'bdbottom',
                                index1 === 0 ? 'bdtop' : '',
                                'vcenter'
                            ]"
                        >
                            <!-- <pre>{{scope.row.children}}</pre> -->
                            <!-- 渲染一级权限 -->

                            <el-col :span="5">
                                <el-tag
                                    closable
                                    @close="
                                        removeRightById(scope.row, item1.id)
                                    "
                                    >{{ item1.authName }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 分割线 --------------------------------------------------------------------------------------------------------------------------------------- -->
                            <!-- 渲染二级/三级权限 -->
                            <el-col :span="19">
                                <!-- 渲染二级权限 -->
                                <el-row
                                    v-for="(item2, index2) in item1.children"
                                    :key="item2.id"
                                    :class="[
                                        index2 === 0 ? '' : 'bdtop',
                                        'vcenter'
                                    ]"
                                >
                                    <!-- 二级权限 -->
                                    <el-col :span="6">
                                        <el-tag
                                            closable
                                            type="success"
                                            @close="
                                                removeRightById(
                                                    scope.row,
                                                    item2.id
                                                )
                                            "
                                        >
                                            {{ item2.authName }}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 分割线 --------------------------------------------------------------------------------------------------------------------------------------------------------------------- -->
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <el-tag
                                            v-for="item3 in item2.children"
                                            :key="item3.id"
                                            v-loading.fullscreen.lock="loading"
                                            closable
                                            element-loading-background="rgba(0, 0, 0, .1)"
                                            element-loading-spinner="el-icon-loading"
                                            element-loading-text="拼命加载中"
                                            type="warning"
                                            @close="
                                                removeRightById(
                                                    scope.row,
                                                    item3.id
                                                )
                                            "
                                        >
                                            {{ item3.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName">
                </el-table-column>
                <el-table-column label="角色描述" prop="roleDesc">
                </el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <!-- 编辑角色 -->
                        <el-button
                            v-loading.fullscreen.lock="loading"
                            element-loading-background="rgba(0, 0, 0, 0.1)"
                            element-loading-spinner="el-icon-loading"
                            element-loading-text="拼命加载中"
                            icon="el-icon-edit"
                            size="mini"
                            type="primary"
                            @click="showEditDialog(scope.row.id)"
                            >编辑
                        </el-button>
                        <!-- 删除角色 -->
                        <el-button
                            v-loading.fullscreen.lock="loading"
                            element-loading-background="rgba(0, 0, 0, 0.1)"
                            element-loading-spinner="el-icon-loading"
                            element-loading-text="拼命加载中"
                            icon="el-icon-delete"
                            size="mini"
                            type="danger"
                            @click="deleteRole(scope.row.id)"
                            >删除
                        </el-button>
                        <!-- 分配权限 -->
                        <el-button
                            icon="el-icon-setting"
                            size="mini"
                            type="warning"
                            @click="showSetRightDialog(scope.row)"
                        >
                            分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 修改角色对话框-->
        <el-dialog
            :visible.sync="editDialogVisible"
            title="修改角色"
            width="50%"
            @close="editDialogClosed"
        >
            <el-form
                ref="editFromRef"
                :model="editFrom"
                :rules="FormRule"
                label-width="100px"
                status-icon
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input
                        v-model="editFrom.roleName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input
                        v-model="editFrom.roleDesc"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoles">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加角色对话框 -->
        <el-dialog
            :visible.sync="addDialogVisible"
            title="添加角色"
            width="50%"
            @close="addDialogClosed"
        >
            <el-form
                ref="addFromRef"
                :model="addFrom"
                :rules="FormRule"
                label-width="100px"
                status-icon
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input
                        v-model="addFrom.roleName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input
                        v-model="addFrom.roleDesc"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog
            :visible.sync="SetRightDialogVisible"
            title="分配权限"
            width="50%"
            @close="setRightDialogClosed"
        >
            <!-- 结构数据 -->
            <el-tree
                ref="treeRef"
                :data="rightsList"
                :default-checked-keys="defKeys"
                :default-expand-all="true"
                :props="treeProps"
                node-key="id"
                show-checkbox
            >
            </el-tree>

            <span slot="footer">
                <el-button @click="SetRightDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                // 所有角色列表
                roleList: [],
                // 决定修改角色对话框是否显示
                editDialogVisible: false,
                // 修改角色表单数据
                editFrom: {},
                // 规则
                FormRule: {
                    roleName: [
                        {
                            required: true,
                            message: '请输入角色名',
                            trigger: 'blur'
                        },
                        { min: 2, max: 10, message: '用户名长度在2~10字符之间' }
                    ],
                    roleDesc: [
                        {
                            required: true,
                            message: '角色描述不能为空',
                            trigger: 'blur'
                        }
                    ]
                },
                // 是否正在删除
                loading: false,
                // 添加角色对话框显示
                addDialogVisible: false,
                // 添加角色表单数据
                addFrom: {},
                // 分配权限的显示
                SetRightDialogVisible: false,
                // 保存所有权限数据
                rightsList: [],
                // 树形控件的属性绑定对象
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                // 默认选中的节点id值
                defKeys: [],
                // 当前分配权限角色的id
                roleId: ''
            };
        },
        created() {
            this.getRoleList();
        },
        methods: {
            // 获取角色列表
            getRoleList() {
                this.axios
                    .get('/roles')
                    .then(res => {
                        this.roleList = res.data.data;
                    })
                    .catch(err => {
                        this.$message.success(
                            '请求角色出错，请稍后再试！' + err
                        );
                    });
            },
            // 编辑角色对话框
            showEditDialog(id) {
                this.axios
                    .get(`roles/${id}`)
                    .then(value => {
                        // 显示对话框
                        this.editDialogVisible = true;
                        this.editFrom = value.data.data;
                    })
                    .catch(error => {
                        this.$message.error(error.message);
                    });
            },
            // 监听修改对话框关闭事件
            editDialogClosed() {
                // 还原对话框输入
                this.$refs.editFromRef.resetFields();
            },
            // 确定编辑角色
            editRoles() {
                this.loading = true;
                // 验证表单是否输入正确
                this.$refs.editFromRef.validate(valid => {
                    //不正确直接返回

                    if (!valid) return;
                    // 发起请求修改用户数据
                    console.log(this.editFrom);
                    this.axios
                        .put(`/roles/${this.editFrom.roleId}`, this.editFrom)
                        .then(value => {
                            this.loading = false;
                            // 通知用户修改成功
                            this.$message.success('修改成功');
                            // 修改用户数据成功,重获取角色列表
                            this.getRoleList();
                            // 关闭对话框
                            this.editDialogVisible = false;
                        })
                        .catch(err => {
                            this.loading = false;
                            this.$message.error('修改用户失败，请稍后再试');
                            this.editDialogVisible = false;
                        });
                });
            },
            // 删除角色
            deleteRole(id) {
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.loading = true;
                        console.log(this.loading);
                        this.axios
                            .delete(`/roles/${id}`)
                            .then(res => {
                                this.loading = false;
                                // 删除成功,重新获取列表
                                this.getRoleList();
                                // 提示用户删除成功
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            })
                            .catch(err => {
                                this.loading = false;
                                this.$message({
                                    type: 'warning',
                                    message: '删除出错,请稍后重试!'
                                });
                            });
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            // 显示添加角色对话框
            showaddDialog() {
                this.addDialogVisible = true;
            },
            // 监听添加对话框关闭事件
            addDialogClosed() {
                this.$refs.addFromRef.resetFields();
            },
            // 添加一个角色
            addRole() {
                // 验证表单数据
                this.$refs.addFromRef.validate(vaild => {
                    if (!vaild) return;
                    // 显示加载中
                    this.loading = true;
                    this.axios
                        .post('/roles', this.addFrom)
                        .then(res => {
                            // 关闭加载中
                            this.loading = false;
                            // 重新获取角色列表
                            this.getRoleList();
                            this.$message.success('添加角色成功!');
                            this.addDialogVisible = false;
                        })
                        .catch(err => {
                            // 关闭加载中
                            this.loading = false;
                            this.$message.success('添加失败!请稍后重试');
                        });
                });
            },
            // 删除一个 权限
            removeRightById(role, id) {
                this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.loading = true;
                        this.axios
                            .delete(`/roles/${role.id}/rights/${id}`)
                            .then(res => {
                                this.loading = false;
                                // console.log(res.data);
                                this.$message({
                                    type: 'success',
                                    message: '删除成功'
                                });
                                // 调用获取数据会重新渲染页面
                                // this.getRoleList()
                                role.children = res.data.data;
                            })
                            .catch(err => {
                                this.loading = false;
                                console.log(err.message);
                                this.$message.error('删除失败，请稍后重试');
                            });
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            // 分配权限显示框
            showSetRightDialog(role) {
                this.roleId = role.id;
                this.axios
                    .get('/rights/tree')
                    .then(res => {
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('获取权限数据失败');
                        }
                        this.rightsList = res.data.data;
                        console.log(this.rightsList);
                        // 获取三级节点id的函数
                        this.getLeafKeys(role, this.defKeys);
                        this.SetRightDialogVisible = true;
                    })
                    .catch(err => {
                        console.log(err);
                        this.$message.error('请求出错，请稍后重试！');
                    });
            },
            // 获取当前角色所有三级权限id
            getLeafKeys(node, arr) {
                // 如果当前节点不包含children 就是一个三级的权限
                if (!node.children) {
                    // 将三级权限id 保存到 arr 中
                    return arr.push(node.id);
                }

                node.children.forEach(item => {
                    this.getLeafKeys(item, arr);
                });
            },
            // 监听添加对话框关闭事件
            setRightDialogClosed() {
                this.defKeys = [];
            },
            // 分配权限函数
            allotRights() {
                const keys = [
                    // element 提供的获取 所有
                    ...this.$refs.treeRef.getCheckedKeys(),
                    //
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ];
                // console.log(keys);
                // 将 数组转换成逗号拼接的字符串
                const idStr = keys.join(',');
                this.axios
                    .post(`/roles/${this.roleId}/rights`, { rids: idStr })
                    .then(res => {
                        if (res.data.meta.status !== 200) {
                            return this.$message.error(
                                '分配权限失败，请稍后重试'
                            );
                        }
                        this.$message.success('分配权限成功');
                        this.getRoleList();
                        this.SetRightDialogVisible = false;
                    })
                    .catch(err => {
                        this.$message.error('分配权限失败，请稍后重试');
                    });
            }
        }
    };
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eeeeee;
    }

    .bdbottom {
        border-top: 1px solid #eeeeee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>
