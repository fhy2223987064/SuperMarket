<template>
    <div class="left-nav">

        <!-- 导航组件 -->
         <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="rgb(48, 65, 86)"
            text-color="#fff"
            active-text-color="rgb(64, 158, 255)"
            unique-opened
            router  
            >
            <!-- 系统管理 -->
            <el-submenu :index="(index + 1) + ''" v-for="(item, index) in menus" :key="index">
                <!-- 图标和标题 -->
                <template slot="title">
                    <i :class="item.iconClass"></i>
                    <span>{{ item.title }}</span>
                </template>

                <!-- 二级导航 -->
                <el-menu-item 
                    v-for="(subItem, index) in item.children" 
                    :key="index" 
                    :index="subItem.path"
                    >
                    {{ subItem.subTitle }}
                </el-menu-item>
            </el-submenu>

        </el-menu>
    </div>
</template>
<script>
export default {
    data(){
        return{
            menus:[]
        }
    },
    methods:{
        getMenus(){
            this.request.get('/account/menus')
                .then(res =>{
                    // console.log(res);  
                    this.menus = res.accessMenu;                 
                })
                .catch(err =>{
                    console.log(err);                   
                })
        }
    },
    created(){
        // 调用  请求菜单数据
        this.getMenus();
    }
}
</script>
<style lang="less">
    // 引入样式
    @import './leftnav.less';
</style>


