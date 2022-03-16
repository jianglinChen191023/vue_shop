<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable
                    @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- table 表格区域 -->
      <el-table :data="orderList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="80">
          <template slot-scope="scope">
            <!-- 0 未付款、1 已付款 -->
            <el-tag v-if="scope.row.pay_status == '0'" type="danger">未付款</el-tag>
            <el-tag v-else-if="scope.row.pay_status == '1'" type="success">已付款</el-tag>
            <el-tag v-else type="warning">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="success" icon="el-icon-location" size="mini"></el-button>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getOrderList } from 'network/order'

export default {
  name: 'Order',
  data () {
    return {
      queryInfo: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      orderList: [],
      total: 0
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    getOrderList () {
      getOrderList(this.queryInfo).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取订单列表失败!')
        }

        this.$message.success('获取订单列表成功!')
        console.log(res)
        this.orderList = res.data.goods
        this.total = res.data.total
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    }
  }
}
</script>

<style scoped>

</style>
