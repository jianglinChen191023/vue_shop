<template>
  <!-- 面包屑导航 -->
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <slot name="home">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      </slot>
      <slot></slot>
      <!--<el-breadcrumb-item>用户管理</el-breadcrumb-item>-->
      <!--<el-breadcrumb-item>用户列表</el-breadcrumb-item>-->
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb'
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
</style>
