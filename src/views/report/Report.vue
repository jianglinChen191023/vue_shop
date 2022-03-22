<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import { getReport } from 'network/report'
import echarts from 'echarts'
import _ from 'lodash'

export default {
  name: 'Report',
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  // 此时页面上的元素已经渲染完成
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'))
    getReport().then(res => {
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据报表失败!')
      }

      this.$message.success('获取数据报表成功!')
      // 准备数据和配置项。
      const result = _.merge(res.data, this.options)
      // 展示数据
      myChart.setOption(result)
    })
  }
}
</script>

<style scoped>

</style>
