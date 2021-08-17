<template>
    <div class='main'>
        <!-- 面包屑  -->
        <el-breadcrumb separator='/'>
            <el-breadcrumb-item :to="{ path: '/home' }"
            >首页
            </el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片主体区域 -->
        <el-card>
            <!-- 搜索与添加用户区 -->
            <el-row :gutter='20'>
                <el-col :span='8'>
                    <el-input
                        v-model='queryInfo.query'
                        clearable
                        placeholder='请输入内容'
                    >
                        <el-button
                            slot='append'
                            icon='el-icon-search'
                            @click='getUserList'
                        >
                        </el-button>
                    </el-input>
                </el-col>
                <el-col :span='4'>
                    <el-button type='primary' @click='addDialogVisible = true'>
                        添加用户
                    </el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区 -->
            <el-table :data='userList' border stripe>
                <!-- 索引列 -->
                <el-table-column type='index'></el-table-column>
                <el-table-column label='姓名' prop='username'></el-table-column>
                <el-table-column label='邮箱' prop='email'></el-table-column>
                <el-table-column label='电话' prop='mobile'></el-table-column>
                <el-table-column label='角色' prop='role_name'>
                </el-table-column>
                <el-table-column label='状态'>
                    <template slot-scope='slotProps'>
                        <el-switch
                            v-model='slotProps.row.mg_state'
                            active-color='#13ce66'
                            inactive-color='#ff4949'
                            @change='userStateChanged(slotProps.row)'
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label='操作' width='300px'>
                    <template slot-scope='scope'>
                        <!-- 修改按钮 -->
                        <el-button
                            circle
                            icon='el-icon-edit'
                            type='primary'
                            @click='showEditDialog(scope.row.id)'
                        >
                        </el-button>
                        <!-- 删除 -->
                        <el-button
                            circle
                            icon='el-icon-delete'
                            type='danger'
                            @click='deleteUser(scope.row.id)'
                        >
                        </el-button>
                        <!-- 提示信息 -->
                        <el-tooltip
                            :enterable='false'
                            class='item'
                            content='分配角色'
                            effect='dark'
                            placement='top'
                        >
                            <!-- 分配角色 -->
                            <el-button
                                circle
                                icon='el-icon-setting'
                                type='warning'
                                @click='showSetRoleDialog(scope.row)'
                            >
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页切换区 -->
            <el-pagination
                :current-page='queryInfo.pagenum'
                :page-size='queryInfo.pagesize'
                :page-sizes='[10, 20, 30, 40]'
                :total='total'
                layout='total, sizes, prev, pager, next, jumper'
                @size-change='handleSizeChange'
                @current-change='handleCurrentChange'
            >
            </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
            :visible.sync='addDialogVisible'
            title='添加用户'
            width='50%'
            @close='addDialogClosed'
        >
            <!-- 内容区 -->
            <el-form
                ref='addFromRef'
                :model='addFrom'
                :rules='FormRule'
                label-width='70px'
            >
                <el-form-item label='用户名' prop='username'>
                    <el-input v-model='addFrom.username'></el-input>
                </el-form-item>
                <el-form-item label='密码' prop='password'>
                    <el-input
                        v-model='addFrom.password'
                        type='password'
                    ></el-input>
                </el-form-item>
                <el-form-item label='邮箱' prop='email'>
                    <el-input v-model='addFrom.email'></el-input>
                </el-form-item>
                <el-form-item label='手机' prop='mobile'>
                    <el-input v-model='addFrom.mobile'></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮区 -->
            <span slot='footer' class='dialog-footer'>
                <el-button @click='addDialogVisible = false'>取 消</el-button>
                <el-button type='primary' @click='addUser'>
                    确 定
                </el-button>
            </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog
            :visible.sync='editDialogVisible'
            title='修改用户'
            width='50%'
            @close='editDialogClosed'
        >
            <el-form
                ref='editFromRef'
                :model='editFrom'
                :rules='FormRule'
                label-width='70px'
                status-icon
            >
                <!--  用户名不可修改 -->
                <el-form-item label='用户名'>
                    <el-input v-model='editFrom.username' :disabled='true'>
                    </el-input>
                </el-form-item>
                <el-form-item label='邮箱' prop='email'>
                    <el-input
                        v-model='editFrom.email'
                        autocomplete='off'
                    ></el-input>
                </el-form-item>
                <el-form-item label='手机' prop='mobile'>
                    <el-input
                        v-model='editFrom.mobile'
                        autocomplete='off'
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot='footer' class='dialog-footer'>
                <el-button @click='editDialogVisible = false'>取 消</el-button>
                <el-button type='primary' @click='edituser'>确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog
            :visible.sync='setRoleDialogVisible'
            title='分配角色'
            width='50%'
        >
            <p class='pinfo'>当前的用户：{{ userInfo.username }}</p>
            <p class='pinfo'>当前的角色：{{ userInfo.role_name }}</p>
            <p class='pinfo'>
                分配新角色：
                <template>
                    <el-select v-model='selectedRoleId' placeholder='请选择'>
                        <el-option
                            v-for='item in roleList'
                            :key='item.id'
                            :label='item.roleName'
                            :value='item.id'
                        >
                        </el-option>
                    </el-select>
                </template>
            </p>

            <span slot='footer'>
                <el-button @click='setRoleDialogVisible = false'
                >取 消</el-button
                >

                <el-button type='primary' @click='assigningRoles(userInfo)'
                >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Users',
        data() {
            // 自定义校验规则
            // 验证邮箱
            let checkEmail = (rule, value, callback) => {
                const regEmail = /^[0-9-A-Za-zd]+([-_.][0-9-A-Za-zd]+)*@([0-9-A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
                if (regEmail.test(value)) {
                    return callback();
                }
                return callback(new Error('请输入合法的邮箱地址'));
            };
            // 验证手机号
            let checkMobile = (rule, value, callback) => {
                const regMobile = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
                if (regMobile.test(value)) {
                    return callback();
                }
                return callback(new Error('请输入合法的手机号'));
            };
            return {
                // 获取用户列表的参数
                queryInfo: {
                    // 搜索用户
                    query: '',
                    // 当前显示的页码
                    pagenum: 1,
                    // 每页多少条
                    pagesize: 10
                },
                // 用户列表
                userList: [],
                // 总人数
                total: 0,
                // 添加用户对话框的显示与隐藏
                addDialogVisible: false,
                // 添加用户表单数据对象
                addFrom: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                // 添加用户的验证规则对象
                FormRule: {
                    username: [
                        {
                            required: true,
                            message: '请输入用户名',
                            trigger: 'blur'
                        },
                        { min: 3, max: 10, message: '用户名长度在3~10字符之间' }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请输入登录密码',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '长度在6~15个字符之间',
                            trigger: 'blur'
                        }
                    ],
                    email: [
                        {
                            required: true,
                            message: '请输入邮箱地址',
                            trigger: 'blur'
                        },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        {
                            required: true,
                            message: '请输入手机号码',
                            trigger: 'blur'
                        },
                        { validator: checkMobile, trigger: 'blur' }
                    ]
                },
                // 控制修改对话框的显示与隐藏
                editDialogVisible: false,
                // 保存要修改对象的信息
                editFrom: {},
                // 控制分配角色对话框是否显示
                setRoleDialogVisible: false,
                // 保存当前分配角色的用户信息
                userInfo: {},
                // 保存所有的角色信息
                roleList: [],
                // 已选中的id值
                selectedRoleId: ''
            };
        },
        mounted() {
            this.getUserList();
        },
        methods: {
            // 获取用户列表
            async getUserList() {
                const { data } = await this.axios.get('/users', {
                    params: this.queryInfo
                });
                if (data.meta.status !== 200) {
                    return this.$message.error('获取用户列表失败');
                }
                this.userList = data.data.users;

                this.total = data.data.total;
            },
            // 监听 pagesize 的改变
            handleSizeChange(newsize) {
                this.queryInfo.pagesize = newsize;
                this.getUserList();
            },
            // 监听页面的切换
            handleCurrentChange(val) {
                this.queryInfo.pagenum = val;
                this.getUserList();
            },
            // 监听开关状态的改变
            async userStateChanged(userinfo) {
                const { data } = await this.axios.put(
                    `users/${userinfo.id}/state/${userinfo.mg_state}`
                );
                try {
                    if (data.meta.status !== 200) {
                        userinfo.mg_state = !userinfo.mg_state;
                        return this.$message.error(data.meta.msg);
                    }
                    this.$message.success(data.meta.msg);
                } catch (error) {
                    this.$message.error(error.message);
                }
            },
            // 监听添加用户对话框关闭事件
            addDialogClosed() {
                this.$refs.addFromRef.resetFields();
            },
            // 添加一个新用户
            addUser() {
                this.$refs.addFromRef.validate(async valid => {
                    if (!valid) return;
                    // 发起请求添加一个新用户
                    const { data } = await this.axios.post(
                        '/users',
                        this.addFrom
                    );

                    if (data.meta.status !== 201) {
                        return this.$message.error('添加用户失败');
                    }

                    this.$message.success('添加用户成功');
                    //隐藏对话框
                    this.addDialogVisible = false;
                    // 重新获取列表数组
                    await this.getUserList();
                });
            },
            // 修改用户按钮对话框
            showEditDialog(id) {
                this.axios
                    .get(`users/${id}`)
                    .then(value => {
                        // 显示对话框
                        this.editDialogVisible = true;
                        this.editFrom = value.data.data;
                    })
                    .catch(error => {
                        this.$message.error(error.message);
                    });
            },
            // 监听修改用户对话框关闭事件
            editDialogClosed() {
                this.$refs.editFromRef.resetFields();
            },
            // 修改用户数据确定按钮
            edituser() {
                // 验证表单是否输入正确
                this.$refs.editFromRef.validate(valid => {
                    //不正确直接返回
                    if (!valid) return;
                    // 发起请求修改用户数据
                    this.axios
                        .put(`/users/${this.editFrom.id}`, this.editFrom)
                        .then(value => {
                            // 通知用户修改成功
                            this.$message.success(value.data.meta.msg);
                            // 修改用户数据成功,重新请求列表数据
                            this.getUserList();
                            // 关闭对话框
                            this.editDialogVisible = false;
                        })
                        .catch(err => {
                            this.$message.error('修改用户失败，请稍后再试');
                        });
                });
            },
            // 删除用户
            deleteUser(id) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.axios
                            .delete(`/users/${id}`)
                            .then(value => {
                                // 删除成功 ，重新获取列表数据
                                this.getUserList();
                                this.$message({
                                    type: 'success',
                                    message: value.data.meta.msg
                                });
                            })
                            .catch(err => {
                                this.$message({
                                    type: 'error',
                                    message: '删除失败，请稍后再试!'
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
            // 点击显示分配角色对话框
            async showSetRoleDialog(userInfo) {
                this.userInfo = userInfo;
                // 展示之前获取所有的角色信息
                const { data: res } = await this.axios.get('roles');
                if (res.meta.status !== 200) {
                    return this.$message.error('获取角色列表失败！');
                }
                this.roleList = res.data;
                this.setRoleDialogVisible = true;
            },
            // 修改角色
            assigningRoles(role) {
                if (!this.selectedRoleId) {
                    return this.$message.info('选中不能为空');
                }
                // 发送请求修改角色
                this.axios.put(`/users/${role.id}/role`, { rid: this.selectedRoleId }).then((res) => {
                    if(res.data.meta.status !== 200) {
                        return this.$message.success('修改角色失败！')
                    }
                    this.$message.success('修改成功！')
                    // 重新获取用户列表
                    this.getUserList()
                    this.setRoleDialogVisible = false;
                }).catch((err) => {
                    this.$message.success('修改角色失败！')
                });

            }
        }
    };
</script>

<style lang='less' scoped>
    .pinfo {
        line-height: 3;
    }
</style>
