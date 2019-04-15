<template>
  <div class="password-modify">
    <!-- 面板 -->
    <el-card class="box-card">
      <!-- 头部标题 -->
      <div slot="header" class="clearfix">
        <h3>修改账号密码</h3>
      </div>
      <!-- 内容 -->
        <el-form style="width:300px" size="small" :model="passwordForm" status-icon :rules="rules" ref="passwordForm" label-width="100px" class="demo-ruleForm">
            <!-- 原密码 -->
            <el-form-item label="原密码" prop="password">
                <el-input type="password" v-model="passwordForm.password" auto-complete="off"></el-input>
            </el-form-item>
            <!-- 新密码 -->
            <el-form-item label="新密码" prop="newPass">
                <el-input type="password" v-model="passwordForm.newPass" auto-complete="off"></el-input>
            </el-form-item>
            <!-- 确认新密码 -->
            <el-form-item label="确认新密码" prop="checkNewPass">
                <el-input type="password" v-model="passwordForm.checkNewPass"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">确认修改</el-button>
            </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入正则
import { passwordReg, passwordNewReg} from '@/utils/validator.js'
// 引入local
import local from '@/utils/local'

export default {

    data(){
        //自定义验证原密码
        const  checkPassword = (rule, value, callback) =>{
            // 请求原密码
            this.request.post('/account/passwordmodify', { oldpassword: value })
                .then(res =>{
                    // console.log(res);
                    // 接收数据
                    let { code, reason } = res;
                    // 判断
                    if(code === 0){
                        callback();  //成功
                    }else{
                        // 失败
                        callback(new Error(reason))
                    }                    
                    
                })
                .catch(err =>{
                    console.log(err);
                    
                })
        }

        // 自定义验证新密码
        const  checkNewPassword = (rule, value, callback) =>{
            // 非空
            if( value === ''){
                callback(new Error('新密码不能为空'))
            }else if( !passwordReg(value) ){
                // 验证正则
                callback(new Error('以字母开头，长度在3~6，只能包含字符、数字和下划线'))
            }else{

                // 验证密码一致性
                if(this.passwordForm.checkNewPass !== ''){
                    // 触发一致性验证
                    this.$refs.passwordForm.validateField('checkNewPass')
                }
                // 成功
                callback()
            }
        }

        // 自定义确认新密码函数
        const confirmPassword = (rule, value, callback) =>{
            if( value === ''){
                // 非空
                callback(new Error('确认密码不能为空'))
            }else if( value !== this.passwordForm.newPass ){
                // 验证两次密码的是否一样
                callback(new Error('两次密码不一致'))
            }else{
                // 成功
                callback()
            }
        }


        return{
            //密码数据
            passwordForm:{
                // 原密码
                password:'',
                // 新密码
                newPass:'',
                // 确认密码
                checkNewPass:''
            },

            // 验证规则
            rules:{
                // 原密码
                password:[
                    { required:true, validator:checkPassword, trigger:'blur'}
                ],
                //新密码
                newPass:[
                    { required:true, validator:checkNewPassword, trigger:'blur'}

                ],
                // 确认新密码
                checkNewPass:[
                    { required:true, validator:confirmPassword, trigger:'blur'}

                ]
            }
        }
    },
    methods:{
        submitForm(){
            // alert('修改密码成功，请重新登录')

            this.$refs.passwordForm.validate( valid =>{
                if(valid){
                    // 发送请求给后端
                    this.request.post('/account/savenewpassword', {newpassword:this.passwordForm.newPass})
                        .then(res =>{
                            // console.log(res);
                            // 接收后端响应的数据
                            let { code, reason } = res;
                            // 判断
                            if(code === 0){
                                // 弹成功提示 
                                this.$message({
                                    type: 'success',
                                    message: reason
                                })

                                // 删除token
                                local.remove('f_h_y_f_c333987')

                                // 跳转到登录页面
                                this.$router.push('/login')

                            }else if (code === 1) {
                                this.$message.error(reason)
                            }                          
                        })
                        .catch(err =>{
                            console.log(err);
                            
                        })
                }else{
                    return
                }
            })
            
        }
    }
};
</script>

<style lang="less">
    @import './passwordmodify.less';
</style>
