
// 专门连接数据库

// 引入mysql
const mysql = require('mysql')

// 创建连接对象
const connection = mysql.createConnection({
    host: 'localhost', // 本地数据库地址
	user: 'root', // 用户名
	password: 'root', // 密码
	database: 'supermarket' // 连接数据库名
})

// 执行连接方法
connection.connect();
console.log('数据库连接成功');

// 暴露模块
module.exports = connection;


