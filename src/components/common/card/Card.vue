<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Card'
}
</script>

<style scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, .15) !important;
}
</style>
