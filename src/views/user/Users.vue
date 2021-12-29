<template>
  <div>
    <!-- 面包屑导航区域 -->
    <breadcrumb>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </breadcrumb>
  </div>
</template>

<script>
import Breadcrumb from 'components/common/breadcrumb/Breadcrumb'

export default {
  name: 'Users',
  components: {
    Breadcrumb
  }
}
</script>

<style scoped>

</style>
