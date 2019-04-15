
// 封装axios请求数据
// 引入axios
import axios from 'axios';
// 引入qs
import qs from 'qs';

import local from '@/utils/local'
// 设置请求的服务器根目录
axios.defaults.baseURL ='http://127.0.0.1:666';
// axios请求拦截器
axios.interceptors.request.use(config => {
    // 获取token
    const token = local.get('f_h_y_f_c333987');
    config.headers.authorization = `Bearer ${token}` 
    return config;
})


// 暴露对象
export default {
    get( url, params={}){
        // 返回承诺
        return new Promise((resolve, reject) =>{
            axios.get(url, {
                params
            })
                .then(response =>{
                    // 成功
                    resolve(response.data)
                })
                .catch(err =>{
                    // 失败
                    reject(err)
                })
        })
    },

    post(url, params={}){
        return new Promise((resolve, reject) =>{
            axios.post(url, qs.stringify(params))
                .then(response =>{
                    // 成功
                    resolve(response.data)
                })
                .catch(err =>{
                    // 失败
                    reject(err)
                })
        })
    }
}


