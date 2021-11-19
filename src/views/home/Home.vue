<template>
  <div class="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout () {
      window.localStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
