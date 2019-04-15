<template>
  <div class="account-manage">
    <!-- 面板 -->
    <el-card class="box-card">
      <!-- 头部标题 -->
      <div slot="header" class="clearfix">
        <h3>账号管理</h3>
      </div>
      <!-- 内容 -->
      <div>

        <el-table @selection-change="handleSelectionChange"  ref="accountTableData"  :data="accountTableData"  tooltip-effect="dark"  style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- 账号 -->
          <el-table-column prop="account" label="账号"></el-table-column>
          <!-- 用户组 -->
          <el-table-column prop="user_group" label="用户组" show-overflow-tooltip></el-table-column>
          <!-- 日期 -->
          <el-table-column label="日期">
            <template slot-scope="scope">{{ scope.row.create_date | filterDate }}</template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
                <!-- 修改 -->
              <el-button size="mini" @click="handleEdit(scope.row.id)">
                <i class="el-icon-edit"></i>
                修改</el-button>
              <!-- 删除 -->
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
                <i class="el-icon-delete"></i>
                删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 修改模态框 -->
        <el-dialog width="400px" title="修改账号" :visible.sync="dialogFormVisible">
          <!-- 修改表单 -->
          <el-form :model="editForm" :rules="rules" ref="editForm">

            <!-- 账号 -->
            <el-form-item prop="account" style="width: 320px;" label="账号" :label-width="formLabelWidth">
              <el-input v-model="editForm.account" auto-complete="off"></el-input>
            </el-form-item>

            <!-- 用户组 -->
            <el-form-item prop="userGroup" label="用户组" :label-width="formLabelWidth">
              <el-select v-model="editForm.userGroup" placeholder="请选择用户组">
                <el-option label="超级管理员" value="超级管理员"></el-option>
                <el-option label="普通用户" value="普通用户"></el-option>
              </el-select>
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
        <div style="margin-top: 20px">
            <el-button type="danger" @click="batchDel">批量删除</el-button>
            <el-button type="primary" @click="cancelSelect">取消选择</el-button>
        </div>

      </div>
    </el-card>
  </div>
</template>

<script>
// 引入moment
import moment from 'moment';

export default {
  data() {
      return{
        //账号数据
        accountTableData:[],
        currentPage:1,
        total:20,
        pageSize:3,

        // 修改模态框数据对象
        editForm:{
          account:'',
          userGroup:''
        },
        // 模态框显示和隐藏状态
        dialogFormVisible:false,
        // 表单标签的宽度
        formLabelWidth:'100px',
        // 修改表单验证规则
        rules:{
          account:[
            {required:true, message:'账号不能为空', trigger:'blur'},
            {min:3, max:6, message:'账号长度 3~6 位', trigger:'blur'}
          ]
        },
        // 要修改的id
        editId:'',
        // 批量删除的数据的id  是一个数组
        selectedId:[]
      }
  },

  methods: {
    /* // 请求所有数据
    getAccountList(){
      // 发送axios 请求所有账号数据
      this.request.get('/account/accountlist')
        .then(res => {
          // 把后端请求到的数据 直接赋值给accountTableData 
          // console.log(res)
          this.accountTableData = res;
        })
        .catch(err => {
          console.log(err)
        })
    }, */

    // 按照分页请求数据
    getAccountListByPage(){
      // 收集参数
      let params = {
        currentPage:this.currentPage,
        pageSize:this.pageSize
      }
      // 请求数据
      this.request.get('/account/accountlistbypage', params)
        .then(res =>{
          // console.log(res); 
          // 接收数据
          let { total, data } = res;
          // 赋值给对应变量
          this.total = total;
          this.accountTableData = data;

          // 如果此页没有数据  回到上页  调用自己  
          if( !data.length && this.currentPage !== 1){
            // 回到上页
            this.currentPage -= 1;
            // 调用自己
            this.getAccountListByPage();
          }
        })
        .catch(err =>{
          console.log(err);          
        })
    },

    // 删除
    handleDelete(id) {
      // console.log(id)
      this.$confirm('你确定要删除吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() =>{
        //收集参数
      let params = {
        id
      }
      //发送请求给后端
      this.request.get('/account/delaccount', params)
        .then(res =>{
          // 接收后端响应数据
          let { code, reason } = res;
          // 判断
          if( code === 0){
            // 弹出成功提示
            this.$message({
              type:'success',
              message:reason
            })
            // 刷新页面
            this.getAccountListByPage()
          }else if(code === 1){
            // 弹出失败提示
            this.$message.error(reason)
          }
        })
        .catch(err =>{
          console.log(err)
        })
      })
      .catch(() =>{
        this.$message({
            type: 'info',
            message: '已取消删除'
        })
      })      
    },

    // 修改
    handleEdit(id) {
      // console.log(id);
      // 显示模态框
      this.dialogFormVisible = true;

      // 把要修改的id保存起来
      this.editId = id;

      //向后台发送请求  传入id
      this.request.get('/account/editaccount', { id })
        .then(res =>{
          // console.log(res[0]);
          // 数据回填
          this.editForm.account = res[0].account;
          this.editForm.userGroup = res[0].user_group;

          // 
        })
        .catch(err =>{
          console.log(err)
        })

    },

    // 确认修改
    saveEdit(){
      // 获取整个表单验证
      this.$refs.editForm.validate(valid =>{
        if(valid){
          // 关闭模态框
          this.dialogFormVisible = false;
          // 获取新数据
          let params = {
            account:this.editForm.account,
            userGroup:this.editForm.userGroup,
            editId:this.editId
          }
          // console.log(params);
          // 发送请求，把新数据和原id发送给后端
          this.request.post('/account/saveeditaccount', params)
            .then(res =>{
              // console.log(res);              
              // 接收后端响应的数据
              let { code, reason } = res;
              if(code === 0 ){
                // 弹成功提示
                this.$message({
                  type:'success',
                  message:reason
                })
                // 刷新列表
                this.getAccountListByPage()
              }else if(code === 1){
                // 弹失败提示
                this.$message.error(reason)
              }

            })
            .catch(err =>{
              console.log(err);             
            })

          
        }else{
          return false; //前端验证不合法，不能通过
        }
      })
    },

    // 当选择框的状态发送变化  就会触发这个函数，  而且传入被选中的数据，val是一个数组
    handleSelectionChange(val){
      // 获取被选中的id  放入一个数组  遍历数组
      this.selectedId = val.map(v => v.id)
      // console.log(this.selectedId);
      
    },

    // 批量删除
    batchDel(){
      // 如果没有选中要批量删除的数据  给出错误提示  结束函数，不再想后端发送
      if( !this.selectedId.length ){
        // 弹出错误提示
        this.$message.error('请选择要删除的数据，再进行此操作')
        return
      }
      this.$confirm('你确定要批量删除吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() =>{  //确定删除
        // 收集被选中的数据的id
      let params = {
        idArr:this.selectedId
      }
      // 把获取到的id发给后端
      this.request.get('/account/batchDel', params)
        .then(res =>{
          // 接收后端响应的数据
          let { code, reason } = res;
          if(code === 0){
            // 弹成功提示
            this.$message({
              type:'success',
              message:reason
            })
            // 刷新列表
            this.getAccountListByPage()
          }else if(code === 1){
            // 弹失败提示
            this.$message.error(reason)
          }
        })
        .catch(err =>{
          console.log(err);          
        })
      }).catch(() =>{  //取消删除
        this.$message({
            type: 'info',
            message: '已取消删除'
        })
      })
      
      
    },
    // 取消选择
    cancelSelect(){
      // 选择整个表格  调用函数取消选择
      this.$refs.accountTableData.clearSelection() 
    },

    // 每页条数
    handleSizeChange(val) {
      // console.log(val);
      // 把每页条数赋值给pageSize
      this.pageSize = val;
      // 调用分页函数
      this.getAccountListByPage();
    },

    // 当前页码
    handleCurrentChange(val) {
      // console.log(val);
      // 把页码值赋值给currentPage
      this.currentPage = val;
      // 调用分页函数
      this.getAccountListByPage();
    }
  },

  // 生命周期钩子函数 vue实例对象创建完成 dom还没有生成
  created () {
    //调用分页函数
    this.getAccountListByPage()
  },

  //过滤时间
  filters:{
    // 过滤时间
    filterDate (time) {
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    }
  }
};
</script>

<style lang="less">
@import "./accountmanage.less";
</style>
