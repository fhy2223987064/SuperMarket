
// 引入vue
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element-ui
import ElementUI from 'element-ui';
// 样式
import 'element-ui/lib/theme-chalk/index.css';

// 引入base.css
import './assets/css/base.css';

// 引入local文件
import local from '@/utils/local.js';

import { Message } from 'element-ui'

// 引入echarts 且挂载在原型上
import echarts from 'echarts'
Vue.prototype.echarts = echarts;

// 引入axios
// import axios from 'axios';
// console.log(axios);
// 把axios挂载在vue原型上
// Vue.prototype.request = axios;


// 引入request.js
import request from './utils/request';
// console.log(request);
// 把request挂载在vue原型上
Vue.prototype.request = request;


// 注册
Vue.use(ElementUI);

// 阻止生产提示
Vue.config.productionTip = false;

// 路由守卫，拦截所有路由
router.beforeEach((to, from, next) =>{
  // alert('拦截')
  // 获取浏览器中的token
  const token = local.get('f_h_y_f_c333987');
  // console.log(token);
  
  if(token){  // 如果token存在 则放行
    // 放行
    next();
  }else{  //没有token
    if(to.path === '/login'){  //如果是去登录界面 则放行
      next();
    }else{  //否则去其他界面 则被拦截  跳到登录界面
      Message.error('不能这样操作，请先登录')
      next('/login')
    }
  }
  
  
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
