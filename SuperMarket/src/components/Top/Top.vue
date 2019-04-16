<template>
    <div class="top">      
        <el-row :gutter="20">
            <!-- 左侧 -->
            <el-col :span="20">
                <!-- 标题 -->
                <h2>
                    <i class="el-icon-menu"></i>
                    华联超市管理系统
                </h2>
            </el-col>

            <!-- 右侧 -->
            <el-col :span="4">
                <el-row>
                    <el-col :span="8">
                        <!-- 头像 -->
                        <div class="avatar">
                            <img width="100%" height="100%" :src="imgUrl" alt="">
                        </div>
                    </el-col>
                    <el-col :span="16"> 
                        <!-- 登录 -->
                        <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            {{ account }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                            <el-dropdown-item command="logout">退出</el-dropdown-item>

                        </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>

// 引入local
import local from '@/utils/local'

export default {
    data () {
        return {
            account: '',
            imgUrl:''
        }
    },
    methods:{
        // 点击下拉框菜单项  触发函数
        handleCommand(command){
            if(command === 'personal'){
                // 跳转到个人中心
                this.$router.push('/home/personal')  

            }else if(command === 'logout'){
                // 清除token
                local.remove('f_h_y_f_c333987');
                // 退出提示
                this.$message({
                    type:'success',
                    message:'退出成功，欢迎你下次再来'
                })

                setTimeout(() => {
                    // 跳转到登录页
                    this.$router.push('/login')
                }, 1000);
            }
        },

        // 获取当前登录账号
        getUserInfo(){
            this.request.get('/account/accountinfo')
                .then(res =>{
                    // console.log(res); 
                    // 接收后端响应的数据
                    let { account, img_url } = res[0];
                    // 赋值给对应的变量
                    this.account = account;
                    this.imgUrl = `http://127.0.0.1:666/${img_url}`;
                    // console.log(img_url);
                    
                })
                .catch(err =>{
                    console.log(err);                   
                })
        }
    },

    created(){
        // 调用函数  获取当前登录的账号
        this.getUserInfo()
    }
}
</script>

<style lang="less">
    @import './top.less';
</style>

