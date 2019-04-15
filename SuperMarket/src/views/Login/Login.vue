<template>
    <div class="login">
        <!-- 表单容器 -->
        <div class="login-wrap">
            
            <!-- 标题 -->
            <div class="title">
                <span class="el-icon-menu"></span>
                华联超市管理系统
            </div>
            
            <!-- 登录表单 -->
            <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                <!-- 账号 -->
                <el-form-item label="账号" prop="account">
                    <el-input type="text" v-model="loginForm.account" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="loginForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>

// 引入验证密码函数
import { passwordReg } from '@/utils/validator';

// 引入local文件
import local from '@/utils/local.js';

export default {
    data(){
        // 确认密码自定义验证函数
        const confirmPassword = ( rule, value, callback) =>{
            if( value === ''){
                callback(new Error('确认密码不能为空'))
            }else if( value !== this.loginForm.password ){
                callback(new Error('两次密码不一样'))
            }else{
                //成功回调
                callback();
            }
        }


        //密码的自定义验证函数
        const checkPassword = (rule, value, callback ) =>{
            // 验证非空
            if( value === ''){
                callback(new Error('密码不能为空'))
            }else if( !passwordReg(value) ){
                callback(new Error('以字母开头，长度在3~6之间，只能包含字符、数字和下划线'))
            }else{

                 // 如果确认密码不为空
                if( this.loginForm.checkPass !== '' ){
                    // 触发一致性验证
                    this.$refs.loginForm.validateField('checkPass')
                }
                //成功回调
                callback()
            }
        }

        return{
            // 表单数据
            loginForm: {
                account: '', 
                password: '',
                checkPass: ''
            },
            // 验证规则
             rules: {
                // 账号
                account: [
                    {required: true, message: '请输入账号', trigger: 'blur'},
                    {min: 3, max: 6, message: '账号长度 3~6 位', trigger: 'blur'}
                ],
                // 密码
                password: [
                    // 自定义验证
                   {required: true, validator: checkPassword, trigger: 'blur'} 
                ],
                // 确认密码
                checkPass: [
                    {required: true, validator: confirmPassword, trigger: 'blur'}
                ]
            }
        }
    },
    methods:{
        // 登录
        submitForm(){
            this.$refs.loginForm.validate( valid =>{
                //如果所有验证都通过，就是true  否则是false
                if( valid ){
                    // 提交数据给后端
                    let params = {
                        account: this.loginForm.account,
                        password: this.loginForm.password
                    }
                    // console.log(params);
                    // 把登录表单数据发送给后端
                    this.request.post('/login/checklogin', params)
                        .then(res =>{
                            // 接收数据
                            let { code, reason, token } = res;
                            //  判断
                            if(code === 0){
                                // 把token存入浏览器
                                local.save('f_h_y_f_c333987', token)

                                // 弹成功提示
                                this.$message({
                                    type:'success',
                                    message:reason
                                })
                                // 跳页面
                                this.$router.push('/home')
                            } else if (code === 1){
                                // 弹失败提示
                                this.$message.error(reason)
                            } 
                        })
                        .catch(err =>{
                            console.log(err);                           
                        })
                    
                    //路由跳转
                    // this.$router.push('/home');

                }else{
                    console.log('验证不通过，不能提交');
                    return;
                }
            })
        },

        //重置表单
        resetForm(){
            this.$refs.loginForm.resetFields();
        }
    }
}
</script>

<style lang="less">
    // 引入样式
    @import "./login.less";
</style>
