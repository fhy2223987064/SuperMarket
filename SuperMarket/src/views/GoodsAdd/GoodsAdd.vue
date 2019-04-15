<template>
    <div class="goods-add">
        <!-- 面板 -->
    <el-card class="box-card">
        <!-- 头部标题 -->
        <div slot="header" class="clearfix">
            <h3>添加商品</h3>
            <span class="goodsMessage">
                1、带<span class="messStar"> * </span>的项目必填  
                2、你可以在这里添加新的商品或编辑已有的商品  
                3、新添加商品的时候可以同时入库（入库必须有数量和进价）
            </span>
        </div>
        <!-- 内容 -->
        <el-form :model="goodsAddForm" status-icon :rules="rules" ref="goodsAddForm" label-width="100px" class="demo-ruleForm">
            <!-- 所属分类 -->
            <el-form-item label="所属分类 ：" prop="classify">
                <el-select style="width:250px" v-model="goodsAddForm.classify" placeholder="请选择分类商品">
                <el-option label="衣物类" value="衣物类"></el-option>
                <el-option label="食品类" value="食品类"></el-option>
                <el-option label="电器类" value="电器类"></el-option>
                </el-select>
            </el-form-item>
            <!-- 商品条形码 -->
            <el-form-item label="商品条形码 :" prop="barcod">
                <el-input style="width:360px" v-model="goodsAddForm.barcod"></el-input>
                <el-button id="code" style="margin-left:20px" type="primary" @click="generateBarcod">生成条形码</el-button>
            </el-form-item>
            <!-- 商品名称 -->
            <el-form-item label="商品名称 :" prop="goodsName">
                <el-input style="width:300px" v-model="goodsAddForm.goodsName"></el-input>
            </el-form-item>
            <!-- 商品售价 -->
            <el-form-item label="商品售价 :" prop="goodsPrice">
                <el-input style="width:200px" v-model="goodsAddForm.goodsPrice"></el-input> 元
            </el-form-item>
            <!-- 市场价 -->
            <el-form-item label="市场价 :" prop="goodsMarket">
                <el-input style="width:200px" v-model="goodsAddForm.goodsMarket"></el-input> 元
                <p style="font-size:12px; line-height:20px; color:#666; margin-left:80px">默认市场价为售价的1.2倍</p>
            </el-form-item>
            <!-- 商品进价 -->
            <el-form-item label="商品进价 :" prop="goodsBid">
                <el-input style="width:200px" v-model="goodsAddForm.goodsBid"></el-input> 元
            </el-form-item>
            <!-- 入库数量 -->
            <el-form-item label="入库数量 :" prop="goodsNum">
                <el-input style="width:200px" v-model="goodsAddForm.goodsNum"></el-input>
                <p style="font-size:12px; line-height:20px; color:#666; margin-left:80px">计重商品单位为kg</p>
            </el-form-item>
            <!-- 商品重量 -->
            <el-form-item label="商品重量 :" prop="goodsWeight">
                <el-input style="width:200px" v-model="goodsAddForm.goodsWeight"></el-input>
            </el-form-item>
            <!-- 商品单位 -->
            <el-form-item label="商品单位 :" prop="goodsUnit">
                <el-input style="width:200px" v-model="goodsAddForm.goodsUnit"></el-input>
            </el-form-item>
            <!-- 会员优惠 -->
            <el-form-item label="会员优惠 :" prop="memberDiscount">
                <el-radio-group v-model="goodsAddForm.memberDiscount">
                <el-radio label="享受"></el-radio>
                <el-radio label="不享受"></el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 是否促销 -->
            <el-form-item label="是否促销 :" prop="sales">
                <el-radio-group v-model="goodsAddForm.sales">
                <el-radio label="启用"></el-radio>
                <el-radio label="禁用"></el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 商品简介 -->
            <el-form-item label="商品简介 :" prop="goodsAbstract">
                <el-input type="textarea" v-model="goodsAddForm.goodsAbstract"></el-input>
                <p style="font-size:12px; line-height:20px; color:#666">不超过200个汉字</p>
            </el-form-item>
            <!-- 添加 -->
            <el-form-item>
                <el-button type="primary" @click="submitForm()">添加</el-button>
            </el-form-item>
        </el-form>
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
            // 添加商品数据
            goodsAddForm:{
                // 分类
                classify:'',
                barcod:'',
                goodsName:'',
                goodsPrice:'',
                goodsMarket:'',
                goodsBid:'',
                goodsNum:'',
                goodsWeight:'',
                goodUnit:'',
                memberDiscount:'',
                sales:'',
                goodsAbstract:''

            },

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
            radio: '1'
        }
    },
    methods:{
        // 生成条形码函数
        generateBarcod(){

            
        },

        //添加按钮
        submitForm(){
            this.$refs.goodsAddForm.validate( valid =>{
                if( valid ){
                    // 收集账号数据
                    let params = {
                        classify: this.goodsAddForm.classify,
                        barcod: this.goodsAddForm.barcod,
                        goodsName: this.goodsAddForm.goodsName,
                        goodsPrice: this.goodsAddForm.goodsPrice,
                        goodsMarket:this.goodsAddForm.goodsMarket,
                        goodsNum:this.goodsAddForm.goodsNum,
                        goodsBid:this.goodsAddForm.goodsBid,
                        goodsWeight:this.goodsAddForm.goodsWeight,
                        goodUnit:this.goodsAddForm.goodUnit,
                        goodsBid:this.goodsAddForm.goodsBid,
                        memberDiscount:this.goodsAddForm.memberDiscount,
                        sales:this.goodsAddForm.sales,
                        goodsAbstract:this.goodsAddForm.goodsAbstract

                    }
                    // 把表单数据发送给后端
                    this.request.post('/goods/goodsadd', params)
                        .then(res =>{
                            // console.log(res);
                            // 接收后端响应的数据
                            let { code, reason } = res;
                            if(code === 0){
                                // 弹成功提示
                                this.$message({
                                    type:'success',
                                    message:reason
                                })
                                // 跳转到商品管理页面
                                this.$router.push('/home/goodsmanage')
                            }else if(code === 1){
                                // 弹失败提示
                                this.$message.error(reason)
                            }
                            
                        })
                        .catch(err =>{
                            console.log(err);
                            
                        })
                   
                }else{
                    console.log('验证不通过');
                    return
                    
                }
            })
        }


    }
}
</script>

<style lang="less">
    @import './goodsadd.less';
</style>
