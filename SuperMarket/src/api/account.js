// /* 所有关于账号部分接口的请求处理 都封装在这个文件中 */ 
// // 引入request.js
// import request from '../utils/request';

// /* 添加账号 */
// export function addAccount (url, params) {
//     return new Promise((resolve, reject) => {
//         request.post(url, params)
//             .then(res => {
//                resolve(res)  // 成功的数据
//             })
//             .catch(err => {
//                reject(err) // 错误信息
//             })
//     })
// }

// /* 请求所有账号数据 */
// export function getAccountList (url, params) {
//     return new Promise((resolve, reject) => {
//         request.post(url, params)
//             .then(res => {
//                resolve(res)  // 成功的数据
//             })
//             .catch(err => {
//                reject(err) // 错误信息
//             })
//     })
// }

