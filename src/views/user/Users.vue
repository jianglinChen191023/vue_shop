<template>
  <div>
    <!-- 面包屑导航区域 -->
    <breadcrumb>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </breadcrumb>

    <!-- 卡片视图区域 -->
    <card>
      <el-card class="box-card">

      </el-card>
    </card>
  </div>
</template>

<script>
import Breadcrumb from 'components/common/breadcrumb/Breadcrumb'
import Card from 'components/common/card/Card'

export default {
  name: 'Users',
  components: {
    Breadcrumb,
    Card
  }
}
</script>

<style scoped>

</style>
