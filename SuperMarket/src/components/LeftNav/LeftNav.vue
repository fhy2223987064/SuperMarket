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
    //动态导航数据
    data(){
        return{
            "menus":[
                {
                    //系统管理
                    iconClass:'el-icon-document',
                    title:'系统管理',
                    //二级
                    children:[
                        {path:'/home/systeminfo', subTitle:'系统信息'}
                    ]
                },
                {
                    // 账号管理
                    iconClass:'el-icon-news',
                    title:'账号管理',
                    children:[
                        {path:'/home/accountmanage', subTitle:'账号管理'},
                        {path:'/home/accountadd', subTitle:'添加账号'},
                        {path:'/home/passwordmodify', subTitle:'密码修改'},
                    ]
                },
                {
                    // 商品管理
                    iconClass:'el-icon-goods',
                    title:'商品管理',
                    children:[
                        {path:'/home/goodsmanage', subTitle:'商品管理'},
                        {path:'/home/goodsadd', subTitle:'添加商品'}
                    ]
                },
                {
                    // 统计管理
                    iconClass:'el-icon-edit-outline',
                    title:'统计管理',
                    children:[
                        {path:'/home/salestotal', subTitle:'销售统计'},
                        {path:'/home/stocktotal', subTitle:'进货统计'}
                    ]
                }
            ]
        }
    }
}
</script>
<style lang="less">
    // 引入样式
    @import './leftnav.less';
</style>


