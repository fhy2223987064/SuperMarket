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
/* router.get('/goodslist', (req, res) =>{
    const sqlStr = `select * from goodsmanage order by id desc`
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        res.send(data)
    })
}) */

// 商品分页
router.get('/goodslistbypage', (req, res) =>{
    // 接收参数
    let { currentPage, pageSize, cateName, keyword } = req.query;

    // 写sql
    let sqlStr = `select * from goodsmanage where 1=1`;

    // 拼接查询条件
    // 如果cateName为空或全部  代表查询所有分类  否则就是按照分类查询
    if (cateName !== '全部' && cateName !== '') {
        sqlStr += ` and classify='${cateName}'`;
    }   
    // 如果kewword为空就是查询所有名称或条形码 否则 就是查询条形码或名称包含关键字的
    if (keyword !== '') {
        sqlStr += ` and(goods_name like '%${keyword}%' or barcod like '%${keyword}%')`
    }
    // 拼接排序
    sqlStr += ` order by id desc`;

    // 查询所有数据
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        // 计算总条数
        let total = data.length;
              
        // 构造分页sql
        let n = (currentPage - 1) * pageSize; 
        sqlStr += ` limit ${n}, ${pageSize}`
        // console.log(sqlStr);
        
        // 执行分页sql
        connection.query(sqlStr, (err, data) =>{
            if(err) throw err;
            res.send({ total, data })
        })
    })

    
})

// 商品查询
/* router.get('/search', (req, res) =>{
    // 接收
    let { cateName, keyword } = req.query;
    // console.log(cateName, keyword);
    // 构造sql
    let sqlStr = `select * from goodsmanage where 1=1`;
    // 如果cateName为空或全部  代表查询所有分类  否则就是按照分类查询
    if (cateName !== '全部' && cateName !== '') {
        sqlStr += ` and classify='${cateName}'`;
    }   
    // 如果kewword为空就是查询所有名称或条形码 否则 就是查询条形码或名称包含关键字的
    if (keyword !== '') {
        sqlStr += ` and(goods_name like '%${keyword}%' or barcod like '%${keyword}%')`
    }
    // 执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        res.send(data);
    })
}) */


// 删除列表
router.get('/delgoods', (req, res) =>{

    // 普通用户权限设置
    if (req.user.user_group === '普通用户') {
		res.send({code: 555, reason: "对不起，你没有权限这样操作！"})
		return;
	}

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
router.get('/editgoods',(req, res) =>{

    

    // 接收id
    let { id } = req.query;
    // 构造sql
    const sqlStr = `select * from goodsmanage where id=${id}`
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        res.send(data)
    })
})

// 修改---保存新数据
router.post('/saveeditgoods', (req, res) =>{

    // 普通用户权限设置
    if (req.user.user_group === '普通用户') {
		res.send({code: 555, reason: "对不起，你没有权限这样操作！"})
		return;
	}

    // 接收参数
    let { classify, barcod, goodsName, goodsPrice, goodsMarket, goodsNum, editId } = req.body;
    // 构造sql
    const sqlStr = `update goodsmanage set classify='${classify}', barcod='${barcod}', goods_name='${goodsName}', goods_price='${goodsPrice}', goods_market='${goodsMarket}', goods_num='${goodsNum}' where id=${editId}`
    // console.log(sqlStr);
    
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        // 受影响行是否大一0
        if(data.affectedRows > 0){
            res.send({code:0, reason:'修改商品信息成功'})
        }else{
            res.send({code:1, reason:'修改商品信息失败'})
        }
    })

})

// 批量删除
router.get('/batchdel', (req, res) =>{

    // 普通用户权限设置
    if (req.user.user_group === '普通用户') {
		res.send({code: 555, reason: "对不起，你没有权限这样操作！"})
		return;
	}

    // 接收id
    let { idArr } = req.query;
    // 构造sql
    const sqlStr = `delete from goodsmanage where id in (${idArr})`
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: '批量删除成功!'})
		} else {
			res.send({code: 1, reason: '批量删除失败!'})
		}
    })
})





module.exports = router;
