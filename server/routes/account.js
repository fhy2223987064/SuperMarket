var express = require('express');
var router = express.Router();

// 引入数据库连接模块
const connection = require('./js/conn')

// 写一个路由  统一设置响应头
router.all('*', (req, res, next) =>{
// 设置响应头解决跨域
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:8080")
    res.setHeader("Access-Control-Allow-Headers", "authorization"); // 允许通过头部信息authorization 携带token
    // 放行
    next()
})



// 验证token合法性
// 准备一个签名（秘钥）
const secretKey = 'fhyfc';
/* 验证token的合法性 */
const expressJwt = require('express-jwt');

// 验证token的合法性
router.use(expressJwt ({
    secret: secretKey
}).unless({
    path: ['/login/checklogin']  // 除了这个地址，其他的URL都需要验证（其他的所有请求 都要带上token 才能获取数据 否则不能获取到数据）
})); 
// 路由拦截器
router.use(function (err, req, res, next) {
    // 如果前端没有token或者是错误的token 就会抛出如下错误
    if (err.name === 'UnauthorizedError') { 
        // 响应给前端token无效的信息
        res.status(401).send('token不合法...');
    }
})



// 添加账号路由
router.post('/accountadd', (req, res) =>{
    // 接收数据
    let { account, password, userGroup } = req.body

    // 写sql
    const sqlStr = `insert into account(account, password, user_group) values('${account}', '${password}', '${userGroup}')`
    console.log(sqlStr);
    
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        // 如果有错抛出错误
        if(err) throw err;
        // 如果受影响行数大于0  就成功   反之
        if( data.affectedRows > 0){
            // 响应成功的数据给前端
            res.send({ code:0, reason:'添加账号成功'})
        }else{
            // 响应失败的数据给前端
            res.send({ code:1, reason:'添加账号失败'})
        }
    })

    // res.send('看到我，说明已经通了！')
})

//请求账号管理列表路由
router.get('/accountlist', (req, res) => {
	// 写sql
	const sqlStr = `select * from account order by create_date desc`;  //查找所有数据 并按时间降序
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send(data);
	})
})

// 删除账号
router.get('/delaccount', (req, res) =>{
    // 接收id
    let { id } = req.query;
    // 构造sql
    const sqlStr = `delete from account where id=${id}`  //根据指定id删除数据
    // console.log(sqlStr);
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        // console.log(data);
        // 如果受影响行数大于0  就成功  反之
        if(data.affectedRows > 0){
            res.send({code:0, reason:'删除数据成功'})  //成功
        }else{
            res.send({code:1, reason:'删除数据失败'})  //失败
        }
        
    })

})

// 修改账号---数据回填
router.get('/editaccount', (req, res) =>{
    // res.send('1')
    // 接收id
    let { id } = req.query;
    // 构造sql  
    const sqlStr = `select * from account where id=${id}` //根据指定id查询数据
    console.log(sqlStr);
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        res.send(data)
    })
})

// 修改账号---确认修改
router.post('/saveeditaccount', (req, res) =>{
    // res.send('1')
    // 接收新数据和原id
    let { account, userGroup, editId } = req.body;
    // 构造sql  
    const sqlStr = `update account set account='${account}', user_group='${userGroup}' where id=${editId}`  //修改表的数据
    // console.log(sqlStr);
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        // 判断  受影响行数是否大于0
        if(data.affectedRows > 0){
            res.send({code:0, reason:'修改成功'})
        }else{
            res.send({code:1, reason:'修改失败'})
        }
    })
    

})

// 批量删除
router.get('/batchDel', (req, res) =>{
    // 接收id
    let { idArr } = req.query;
    // 构造sql
    const sqlStr = `delete from account where id in (${idArr})`  //删除指定id的数据
    // console.log(sqlStr);  
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        if(data.affectedRows > 0){
            res.send({code:0, reason:'批量删除成功'})
        }else{
            res.send({code:1, reason:'批量删除失败'})
        }
    })
})

// 分页功能
router.get('/accountlistbypage', (req, res) =>{
    // 接收参数
    let { currentPage, pageSize } = req.query;
    // 构造sql  
    let sqlStr = `select * from account order by create_date desc`  //查找所有数据
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        // console.log(data);
        // 计算数据总和
        let total = data.length;
        // 每个页码对应的数据  计算跳过多少条
        let n = (currentPage - 1) * pageSize;
        // 拼接分页sql
        sqlStr += ` limit ${n}, ${pageSize}`
        // console.log(sqlStr);      

        // // 执行sql
        connection.query(sqlStr, (err, data) =>{
            if(err) throw err;
            // console.log(data);
            // 把数据发送给前端
            res.send({total, data})
        })
        
    })

})


// 检查原密码
router.post('/passwordmodify', (req, res) =>{
    // res.send('1')
    // 接收参数
    let { oldpassword } = req.body;
    // 原密码
    let { password } = req.user;
    // 判断
    if( oldpassword === password ){
        res.send({code:0, reason:'验证原密码正确'})
    }else {
        res.send({code:1, reason:'验证原密码错误'})
    }
    
    
})

// 修改密码
router.post('/savenewpassword', (req, res) =>{
    // 接收参数
    let { newpassword } = req.body;
    // 获取当前用户登录的id
    let { id } = req.user;

    // 构造sql
    const sqlStr = `update account set password='${newpassword}' where id='${id}'`
    // console.log( '哈哈哈',sqlStr);
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        if(data.affectedRows > 0){
            res.send({code:0, reason:'密码修改成功'})
        }else{
            res.send({code:1, reason:'密码修改失败'})
        }
    })

    
})

module.exports = router;
