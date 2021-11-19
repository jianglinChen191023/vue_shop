<template>
  <div class="avatar_box">
    <img src="~assets/logo.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'AvatarBox'
}
</script>

<style scoped>
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
</style>
