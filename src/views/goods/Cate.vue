<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->

      <!-- 分页区域 -->
    </el-card>
  </div>
</template>

<script>
import { getCateList } from 'network/cate'

export default {
  name: 'Cate',
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表, 默认为空
      cateList: {},
      // 总数据条数
      total: 0
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    getCateList () {
      getCateList(this.queryInfo).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('获取商品分类失败!')
        }

        this.$message.success('获取商品分类成功!')
        // 把数据列表,赋值给 cateList
        this.cateList = res.data.result
        console.log(this.cateList)
        // 为总数据条数赋值
        this.total = res.data.total
      })
    }
  }
}
</script>

<style scoped>

</style>
