<template>
    <div class="sales-total">
         <!-- 面板组件 -->
       <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix">
                <span>销售统计</span>
            </div>
            <!-- 内容 -->
            <div class="text item">
                <!-- 1 准备一个容器 -->
                <div id="box" style="height: 400px;"></div>
            </div>

        </el-card>
    </div>
</template>
<script>

export default {
    // 生命周期钩子函数 适合操作dom
   mounted() {
      // 2019-04-10 2019-04-15
      // 这是后端响应的数据   
      var res = {
          categoryName: ['2019-04-10', '2019-04-11', '2019-04-12', '2019-04-13', '2019-04-14', '2019-04-15', '2019-04-16', '2019-04-17'],
          value: [500, 2800, 2000, 2000, 3990, 460, 4689, 3000]
      }

      let {categoryName, value} = res;

      this.drawSalesChart(categoryName, value); // 调用函数 生成报表
   },
   methods: {
    // 生成销售报表
    drawSalesChart(categoryData=[], value=[]) {
        // 选中dom容器 初始化
        let myChart = this.echarts.init( document.getElementById('box') )
        // 准备配置
        let option = {
            tooltip: {
                show: true
            },
            legend: {
                data:['销量']
            },
            xAxis : [
                {
                    type : 'category',
                    data : categoryData
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    "name":"销量",
                    "type":"line",
                    "data":value
                }
            ]
        }
        // 使用配置生成报表
        myChart.setOption( option )
    }
   }
}
</script>
<style lang="less">
    .sales-total {
        // 面板组件
        .el-card {
            // 面板头
            .el-card__header {
                font-size: 20px;
                font-weight: bold;
                background-color: #f1f1f1;
            }
            // 面板身体
            .el-card__body {
                // 表单
                .el-form {
                    // 每一项
                    .el-form-item {
                        margin-bottom: 30px;
                    }
                }
            }
        }
    }
</style>

