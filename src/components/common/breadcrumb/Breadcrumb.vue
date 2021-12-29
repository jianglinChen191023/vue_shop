<template>
  <!-- 面包屑导航 -->
  <div>
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

</style>
