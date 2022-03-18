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
          <template slot-scope="scope">
            <el-button @click="showBox(scope.row.order_id, scope.row.order_price)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button @click="showProgressBox" type="success" icon="el-icon-location" size="mini"></el-button>
          </template>
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

    <!-- 修改地址的对话框 -->
    <el-dialog
        title="修改地址"
        :visible.sync="updateDialogVisible"
        width="50%"
        @close="updateDialogClosed">

      <!-- 表单 -->
      <el-form :rules="updateRules" ref="updateFormRef" :model="updateForm" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="updateForm.address1" expand-trigger="hover"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="updateForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrder">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度的对话框 -->
    <el-dialog
        title="物流进度"
        :visible.sync="progressDialogVisible"
        width="50%">
      <el-timeline>
        <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, getKuaidiById, updateOrder } from 'network/order'
import cityData from './citydata'

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
      total: 0,
      // 控制地址修改对话框的显示与隐藏
      updateDialogVisible: false,
      updateForm: {
        address1: [],
        address2: ''
      },
      updateRules: {
        address1: [{
          required: true,
          message: '请选择省市区/县',
          trigger: 'blur'
        }],
        address2: [{
          required: true,
          message: '请填写详情地址',
          trigger: 'blur'
        }]
      },
      cityData,
      // 控制物流进度对话框的显示与隐藏
      progressDialogVisible: false,
      // 物流进度
      progressInfo: [],
      // 修改地址的 id
      order_id: 0,
      // 修改地址请求所需要的参数 订单价格
      order_price: 0
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
        this.orderList = res.data.goods
        console.log(this.orderList)
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
    },
    // 展示修改地址对话框
    showBox (id, price) {
      this.order_id = id
      this.order_price = price
      this.updateDialogVisible = true
    },
    // 监听修改地址对话框的关闭事件
    updateDialogClosed () {
      this.$refs.updateFormRef.resetFields()
      this.order_id = 0
      this.order_price = 0
    },
    // 显示物流进度的对话框
    showProgressBox () {
      // 获取物流进度
      getKuaidiById('1106975712662').then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取物流进度失败!')
        }

        this.progressInfo = res.data
        this.progressDialogVisible = true
      })
    },
    // 修改地址
    updateOrder () {
      updateOrder(this.order_id, {
        consignee_addr: this.updateForm.address1 + ' ' + this.updateForm.address2,
        order_price: this.order_price
      }).then(res => {
        if (res.meta.status !== 201) {
          this.$message.error('修改地址失败!')
        }

        this.$message.success('修改地址成功!')
        this.updateDialogVisible = false
        this.getOrderList()
      })
    }
  }
}
</script>

<style scoped>
@import '../../plugins/element/timeline/timeline.css';
@import '../../plugins/element/timeline-item/timeline-item.css';

.el-cascader {
  width: 100%;
}
</style>
