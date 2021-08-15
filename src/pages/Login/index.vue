<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../../assets/logo.png" />
            </div>
            <!-- 登录表单区域  :model="loginForm" 数据收集对象  :rules="rules" 验证规则对象 -->
            <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginFormRules"
                label-width="0px"
                class="login_form"
            >
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input
                        type="text"
                        prefix-icon="el-icon-user-solid"
                        v-model="loginForm.username"
                    ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        prefix-icon="el-icon-lock"
                        v-model="loginForm.password"
                    ></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            // 登录表单的数据
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            loginFormRules: {
                // 验证用户名是否合法
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur'
                    }
                ],
                // 验证密码是否合法
                password: [
                    {
                        required: true,
                        message: '请输入登录密码',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 15,
                        message: '长度在 6 到 15 个字符',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        // 点击重置
        reset() {
            this.$refs.loginFormRef.resetFields();
        },
        // 登录
        login() {
            this.$refs.loginFormRef.validate(valid => {
                if (!valid) return;
                this.axios.post('/login', this.loginForm).then(response => {
                    const { data } = response;
                    // 失败,提示信息
                    if (data.meta.status !== 200)
                        return this.$message.error(data.meta.msg);
                    // 成功
                    this.$message({
                        message: data.meta.msg,
                        type: 'success'
                    });
                    // 保存token 会话存储
                    window.sessionStorage.setItem('token', data.data.token);
                    this.$router.push('/home');
                });
            });
        }
    }
};
</script>

<style lang="less" scoped>
// 背景
.login_container {
    background-color: #2b4b6b;
    height: 100%;

    // 输入框盒子
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        // 头像
        .avatar_box {
            width: 130px;
            height: 130px;
            border-radius: 50%;
            border: 1px solid #eee;
            background-color: #fff;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            top: -68px;
            transform: translateX(-50%);
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
        // 登录表单区域
        .login_form {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
        }
        .btns {
            display: flex;
            justify-content: center;
        }
    }
}
</style>
