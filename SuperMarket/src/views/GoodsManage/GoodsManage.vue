<template>
    <div class="goods-manage">
        <!-- 面板 -->
        <el-card class="box-card">
            <!-- 头部标题 -->
            <div slot="header" class="clearfix">
                <h3>添加商品</h3>           
            </div>
            <!-- 内容 -->
            <!-- 选择分类 和 模糊查询 -->
            <div>
                <el-form size="mini" :inline="true" :model="searchForm" class="demo-form-inline">
                    <!-- 分类 -->
                    <el-form-item label="选择分类" prop="cateName">
                        <el-select v-model="searchForm.cateName" placeholder="请选择分类">
                        <el-option label="全部" value="全部"></el-option>
                        <el-option label="衣物类" value="衣物类"></el-option>
                        <el-option label="食品类" value="食品类"></el-option>
                        <el-option label="电器类" value="电器类"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 关键字 -->
                    <el-form-item label="关键字">
                    <el-input v-model="searchForm.keyword" placeholder="商品名称或条形码"></el-input>
                    </el-form-item>
                    <!-- 查询按钮 -->
                    <el-form-item>
                    <el-button size="mini" type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div>
                <el-table @selection-change="handleSelectionChange"  ref="goodsTableData"  :data="goodsTableData"  tooltip-effect="dark"  style="width: 100%">
                <el-table-column type="selection" width="55"></el-table-column>
                <!-- 条形码 -->
                <el-table-column prop="barcod" label="条形码"></el-table-column>
                <!-- 商品名称 -->
                <el-table-column prop="goods_name" label="商品名称" show-overflow-tooltip></el-table-column>
                <!-- 所属分类 -->
                <el-table-column prop="classify" label="所属分类"></el-table-column>
                <!-- 商品售价 -->
                <el-table-column prop="goods_price" label="商品售价"></el-table-column>
                <!-- 市场价 -->
                <el-table-column prop="goods_market" label="市场价"></el-table-column>
                <!-- 入库数量 -->
                <el-table-column prop="goods_num" label="入库数量"></el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- 修改按钮 -->
                            <el-button
                                size="mini"
                                type="primary"
                                @click="handleEdit(scope.row.id)"
                                >
                                <i class="el-icon-edit"></i>
                            </el-button>
                            <!-- 删除按钮 -->
                            <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.row.id)"
                                >
                                <i class="el-icon-delete"></i>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 修改模态框 -->
                <el-dialog width="400px" title="修改商品信息" :visible.sync="dialogFormVisible">
                    <!-- 修改表单 -->
                    <el-form :model="editForm" status-icon :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">

                        <el-form-item label="所属分类 ：" prop="classify">
                            <el-select style="width:250px" v-model="editForm.classify" placeholder="请选择分类商品">
                            <el-option label="衣物类" value="衣物类"></el-option>
                            <el-option label="食品类" value="食品类"></el-option>
                            <el-option label="电器类" value="电器类"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 商品条形码 -->
                        <el-form-item label="商品条形码 :" prop="barcod">
                            <el-input style="width:200px" v-model="editForm.barcod"></el-input>
                        </el-form-item>
                        <!-- 商品名称 -->
                        <el-form-item label="商品名称 :" prop="goodsName">
                            <el-input style="width:200px" v-model="editForm.goodsName"></el-input>
                        </el-form-item>
                        <!-- 商品售价 -->
                        <el-form-item label="商品售价 :" prop="goodsPrice">
                            <el-input style="width:200px" v-model="editForm.goodsPrice"></el-input> 元
                        </el-form-item>
                        <!-- 市场价 -->
                        <el-form-item label="市场价 :" prop="goodsMarket">
                            <el-input style="width:200px" v-model="editForm.goodsMarket"></el-input> 元
                            <p style="font-size:12px; line-height:20px; color:#666; margin-left:10px">默认市场价为售价的1.2倍</p>
                        </el-form-item>

                        <!-- 入库数量 -->
                        <el-form-item label="入库数量 :" prop="goodsNum">
                            <el-input style="width:200px" v-model="editForm.goodsNum"></el-input>
                            <p style="font-size:12px; line-height:20px; color:#666; margin-left:10px">计重商品单位为kg</p>
                        </el-form-item>

                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                    </div>
                </el-dialog>

                <!-- 分页 -->
                <div style="margin:30px 10px 0" class="block">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[1, 3, 5, 10, 20, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                </div>

                <!-- 批量删除和取消选择 -->
                <div style="margin:20px 40px">
                    <el-button type="danger" @click="batchDel">批量删除</el-button>
                    <el-button style="margin-left:30px" type="primary" @click="cancelSelect">取消选择</el-button>
                </div>

            </div>
        
        </el-card>
    </div>
</template>

<script>
// 引入正则
import { numReg } from '@/utils/validator';

export default {
    data(){

                // 商品售价自定义验证
        const priceGoods = (rule, value, callback ) =>{
            if( value === ''){
                callback(new Error('商品售价不能为空'))
            }else if( !numReg(value) ){
                callback(new Error('售价为0以上的数字'))
            }else{
                //成功回调
                callback();
            }
        }
        // 市场价
        const marketGoods = (rule, value, callback ) =>{
            if( value === ''){
                callback(new Error('市场价不能为空'))
            }else if( !numReg(value) ){
                callback(new Error('市场价为0以上的数字'))
            }else{
                //成功回调
                callback();
            }
        }
        // 入库数量
        const numGoods = (rule, value, callback ) =>{
            if( value === ''){
                callback(new Error('入库数量不能为空'))
            }else if( !numReg(value) ){
                callback(new Error('入库数量为0以上的数字'))
            }else{
                //成功回调
                callback();
            }
        }

        return{
            // 选择和模糊查询
            searchForm: { 
                cateName: '',
                keyword: ''
            },

            // 表格
            goodsTableData:[],
            // 模态框显示隐藏
            dialogFormVisible: false, 
            // 模态框修改
            editForm: {
                classify:'',
                barcod:'',
                goodsName:'',
                goodsPrice:'',
                goodsMarket:'',
                goodsNum:''
            }, 

            currentPage: 1,  
            pageSize: 3,
            // 数据总条数
            total: 0, 
            // 要修改的数据的id
            editId:'',
            // 验证规则
            rules:{
                // 分类
                classify:[
                    { required:true, message:'请选择分类商品', trigger:'change'}
                ],
                // 商品条形码
                barcod:[
                    { required:true, message:'请点击生成条形码', trigger:'blur'}
                ],
                // 商品名称
                goodsName:[
                    { required:true, message:'请填写商品名称', trigger:'blur'}
                ],
                // 商品售价
                goodsPrice:[
                    { required:true, validator: priceGoods, trigger:'blur'}
                ],
                // 市场价
                goodsMarket:[
                    { required:true, validator: marketGoods, trigger:'blur'}
                ],
                // 入库数量
                goodsNum:[
                    { required:true, validator: numGoods, trigger:'blur'}
                ]

            },
            // 批量删除选中的id数组
            selectedId:[]
        }
    },
    methods:{
        /* // 请求所有商品数据
        getGoodsList(){
            this.request.get('/goods/goodslist')
                .then(res =>{
                    // console.log(res);
                    this.goodsTableData = res;                    
                })
                .catch(err =>{
                    console.log(err);                    
                })
        }, */

       // 按照分页请求数据
        getGoodsListByPage(){
            // 收集参数
            let params =  {
                currentPage : this.currentPage,
                pageSize : this.pageSize,
                cateName:this.searchForm.cateName,
                keyword:this.searchForm.keyword
            }
            // 发送请求给后端
            this.request.get('/goods/goodslistbypage', params)
                .then(res =>{
                    // console.log(res); 
                    // 接收后端响应的数据
                    let { total, data } = res;
                    // 赋值给对应的变量
                    this.total = total;
                    this.goodsTableData = data;

                    // 分页小bug处理
                    if( this.currentPage !== 1 && !data.length ){
                        // 回到上一页
                        this.currentPage -= 1;
                        // 调用自己
                        this.getGoodsListByPage();
                    }
                })
                .catch(err =>{
                    console.log(err);                    
                }) 
        },

       // 点击查询函数
        search(){
            // 调用分页函数
            this.getGoodsListByPage();

            /* // 收集查询参数
            let params = {
                cateName:this.searchForm.cateName,
                keyword:this.searchForm.keyword
            }
            // console.log(params);
            this.request.get('/goods/search', params)
                .then(res =>{
                    // console.log(res); 
                    // 接收后端响应的数据  赋值给表格
                    this.goodsTableData = res;                  
                })
                .catch(err =>{
                    console.log(err);                    
                }) */            
        },

        // 当选择框的状态发送变化  就会触发这个函数，  而且传入被选中的数据，val是一个数组
        handleSelectionChange(val){
            this.selectedId = val.map(v => v.id);
        },
            // 获取被选中的id 放入一个数组
      
        // 修改
        handleEdit(id) {
            // 显示模态框
            this.dialogFormVisible = true;
            // 把要修改的id保存起来
            this.editId = id;
            // 把id发送给后端
            this.request.get('goods/editgoods', { id })
                .then(res =>{
                    // console.log(res);
                    // 接收后端响应的数据  数据回填
                    this.editForm.classify = res[0].classify;
                    this.editForm.barcod = res[0].barcod;
                    this.editForm.goodsName = res[0].goods_name;
                    this.editForm.goodsPrice = res[0].goods_price;
                    this.editForm.goodsMarket = res[0].goods_market;
                    this.editForm.goodsNum = res[0].goods_num;
                })
                .catch(err =>{
                    console.log(err);                    
                })
        },

        // 保存修改
        saveEdit() {
            // 获取这个表单验证
            this.$refs.editForm.validate(valid =>{
                // 前端验证通过
                if(valid){
                    // 关闭模态框
                    this.dialogFormVisible = false;
                    // 收集参数
                    let params = {
                        classify:this.editForm.classify,
                        barcod:this.editForm.barcod,
                        goodsName:this.editForm.goodsName,
                        goodsPrice:this.editForm.goodsPrice,
                        goodsMarket:this.editForm.goodsMarket,
                        goodsNum:this.editForm.goodsNum,
                        editId: this.editId
                    }
                    // 把新数据和原id一起发送给后端
                    this.request.post('/goods/saveeditgoods', params)
                        .then(res =>{
                            // console.log(res); 
                            // 接收后端响应的数据
                            let { code, reason } = res;
                            // 判断
                            if(code === 0){
                                // 弹成功提示
                                this.$message({
                                    type:'success',
                                    message:reason
                                })
                                // 刷新列表
                                this.getGoodsListByPage()
                            }else if(code === 1){
                                // 弹失败提示
                                this.$message.error(reason);
                            }else if(code === 555){
                                // 弹失败提示
                                this.$message.error(reason)
                        }     
                        })
                        .catch(err =>{
                            console.log(err);                          
                        })

                }
            })
        },

        // 删除
        handleDelete(id){
            // alert('1')
            // 优化删除体验
            this.$confirm('你确定要删除吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 发送请求给后端
                this.request.get('/goods/delgoods', { id })
                    .then(res =>{
                        // console.log(res);
                        // 接收数据
                        let { code, reason } = res;
                        // 判断
                        if(code === 0){
                            // 弹成功提示
                            this.$message({
                                type:'success',
                                message:reason
                            })
                            // 刷新列表
                            this.getGoodsListByPage()

                        }else if(code === 1){
                            // 弹失败提示
                            this.$message.error(reason)
                        }else if(code === 555){
                            // 弹失败提示
                            this.$message.error(reason)
                        }                   
                    })
                    .catch(err =>{
                        console.log(err);                   
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },

        // 批量删除
        batchDel() {
            // 如果没有选中  给出错误提示  结束函数
            if( !this.selectedId.length){
                // 弹错误提示
                this.$message.error('请选择以后再进行此操作！');
                return
            }

            // 优化删除体验
            this.$confirm('你确定要批量删除吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 收集被选中的数据的id
                let params = {
                    idArr: this.selectedId
                }
                // 把被选中的id们一起发送给后端
                this.request.get('/goods/batchdel', params)
                    .then(res =>{
                        // console.log(res);  
                        // 接收数据
                        let { code, reason } = res;
                        if (code === 0) {
                            // 弹成功提示
                            this.$message({
                                type: 'success',
                                message: reason
                            })
                            // 刷新列表
                            this.getGoodsListByPage();
                
                        } else if (code === 1) {
                            // 弹失败提示
                            this.$message.error(reason)
                        }else if(code === 555){
                            // 弹失败提示
                            this.$message.error(reason)
                        }         
                    })
                    .catch(err =>{
                        console.log(er);                      
                    })
            }).catch(() => { // 取消
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },

        // 每页条数改变
        handleSizeChange(val) {
            this.pageSize = val;
            this.getGoodsListByPage()
        },
        // 当前页改变
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getGoodsListByPage()
        },

        // 取消批量选择
        cancelSelect() {
            // 选中整个表格  调用函数取消选择
            this.$refs.goodsTableData.clearSelection()
        }
    },

    // 生命周期钩子函数 vue实例对象创建完成 dom还没有生成
    created () {
        // 调用
        this.getGoodsListByPage()

    },
  
}
</script>

<style lang="less">
    @import './goodsmanage.less';
</style>
