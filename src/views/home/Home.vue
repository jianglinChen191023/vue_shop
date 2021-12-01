<template>
  <div class="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Home',
  methods: {
    ...mapActions({
      updateToken: 'updateToken'
    }),
    logout () {
      this.updateToken('')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
