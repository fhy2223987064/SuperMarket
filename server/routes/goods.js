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




// 商品路由
router.post('/goodsadd', (req,res) =>{
    // res.send('11')
    // 接收数据
    let { barcod, goodsName, classify, goodsPrice, goodsMarket, goodsNum, goodsWeight, goodUnit, goodsBid, memberDiscount, sales, goodsAbstract} = req.body;
    // 构造sql
    const sqlStr = `insert into goodsmanage(barcod, goods_name, classify, goods_price, goods_market, goods_num) values('${barcod}', '${goodsName}', '${classify}','${goodsPrice}','${goodsMarket}','${goodsNum}')`
    // console.log(sqlStr);  
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        // 受影响行数
        if(data.affectedRows > 0){
            // 成功
            res.send({code:0, reason:'商品添加成功'})
        }else{
            // 失败
            res.send({code:1, reason:'商品添加失败'})
        }
    })

})

// 获取商品列表数据
router.get('/goodslist', (req, res) =>{
    const sqlStr = `select * from goodsmanage order by id desc`
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        res.send(data)
    })
})

// 商品分页


// 删除列表
router.get('/delgoods', (req, res) =>{
    // 接收id
    let { id } = req.query;
    // 构造sql
    const sqlStr = `delete from goodsmanage where id=${id}`
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        if(data.affectedRows > 0){
            res.send({code:0, reason:'删除商品信息成功！'})
        }else{
            res.send({code:1, reason:'删除商品信息失败！'})
        }
    })
})


// 修改---数据回填
router.get('/editgoods')





module.exports = router;
