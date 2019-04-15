<template>
    <div class="account-add">
        <!-- 面板 -->
        <el-card class="box-card">
            <!-- 头部标题 -->
            <div slot="header" class="clearfix">
                <h3>添加管理员账号</h3>
            </div>

            <!-- 内容 -->
            <el-form style="width:300px" size="small" :model="accountAddFrom" status-icon :rules="rules" ref="accountAddFrom" label-width="100px" class="demo-ruleForm">
                <!-- 账号 -->
                <el-form-item label="账号" prop="account">
                    <el-input type="text" v-model="accountAddFrom.account" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="accountAddFrom.password" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 确认密码 -->
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="accountAddFrom.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 选择用户组 -->
                <el-form-item label="选择用户组" prop="userGroup">
                    <el-select v-model="accountAddFrom.userGroup" placeholder="请选择用户组">
                    <el-option label="超级管理员" value="超级管理员"></el-option>
                    <el-option label="普通用户" value="普通用户"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm()">添加</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>

            </el-form>
        </el-card>
    </div>
</template>

<script>
// 引入正则
import { passwordReg } from '@/utils/validator.js';
// 引入qs
import qs from 'qs';

// 引入请求方法
// import { addAccount } from '@/api/account';

export default {
    data(){

        // 自定义验证密码函数
        const checkPassword = (rule, value, callback) => {
            // 非空
            if( value === ''){
                callback(new Error('密码不能为空'))
            }else if( !passwordReg(value) ){
                // 验证正则
                callback(new Error('以字母开头，长度在3~6，只能包含字符、数字和下划线'))
            }else{
                if(this.accountAddFrom.checkPass !== ''){
                    // 触发一致性验证
                    this.$refs.accountAddFrom.validateField('checkPass');
                }
                // 成功
                callback()
            }
        }

        // 自定义确认密码函数
        const confirmPassword = (rule, value, callback) =>{
            if( value === ''){
                // 非空
                callback(new Error('确认密码不能为空'))
            }else if( value !== this.accountAddFrom.password ){
                // 验证两次密码的是否一样
                callback(new Error('两次密码不一致'))
            }else{
                // 成功
                callback()
            }
        }

        return{
            // 添加账号数据
            accountAddFrom:{
                account:'',
                password:'',
                checkPass:'',
                userGroup:''
            },
            // 验证规则
            rules:{
                // 账号
                account:[
                    // 非空
                    { required:true, message:'请输入账号', trigger:'blur'},
                    // 长度
                    { min:3, max:6, message:'账号长度 3~6 位', trigger:'blur' }
                ],
                // 密码
                password:[
                    // 自定义验证
                    { required:true, validator:checkPassword, trigger:'blur'}
                ],
                // 确认密码
                checkPass:[
                    { required:true, validator:confirmPassword, trigger:'blur'}
                ],
                // 用户组
                userGroup: [
                    {required: true, message: '请选择用户组', trigger: 'change'} // 非空
                ]
            }
        }
    },
    methods:{
        // 添加账号
        submitForm(){
            this.$refs.accountAddFrom.validate( valid =>{
                if( valid ){
                    // 收集账号数据
                    let params = {
                        account: this.accountAddFrom.account,
                        password: this.accountAddFrom.password,
                        userGroup: this.accountAddFrom.userGroup,
                    }
                    // console.log(params);
                    // 跳转
                    // this.$router.push('/home/accountmanage')

                    // 发送axios 请求
                    // console.log(this.request);
                    // get请求
                    /* this.request.get('/url',{
                        params
                    }).then(response =>{
                        console.log(response.data);
                        
                    }).catch(err =>{
                        console.log(err);                       
                    }) */

                    // post请求
                    /* this.request.post('/url', qs.stringify(params) )
                        .then(response =>{
                        console.log(response.data);                       
                    })
                        .catch(err =>{
                            console.log(err);                       
                        }) */


                    /* // console.log(addAccount);
                    addAccount('/account/accountadd', params)
                        .then(res =>{
                            console.log('成功：', res);                       
                        })
                        .catch(err =>{
                            console.log('失败：', err);
                            
                        }) */



                    this.request.post('/account/accountadd', params)
                        .then(res =>{
                            // 获取后端响应回来的数据
                            let { code, reason } = res;
                            // 判断
                            if(code === 0){
                                // 成功提示
                                this.$message({
                                    type:'success',
                                    message:reason
                                })
                                // 跳转到账号管理
                                this.$router.push('/home/accountmanage')

                            }else if(code === 1){
                                // 失败提示
                                this.$message.error(reason)
                            }
                        })    
                        .catch(err =>{
                            console.log(err);                          
                        }) 




                    
                }else{
                    console.log('验证不通过，不能提交数据');
                    return
                    
                }
            })
        },

        // 重置
        resetForm(){
            this.$refs.accountAddFrom.resetFields()
        }
    }
}
</script>

<style lang="less">
    @import './accountadd.less';
</style>
