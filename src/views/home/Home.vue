<template>
  <div class="home">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="~assets/img/home/heima.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!--页面主体区域-->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单区域 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="menu.id + ''" v-for="menu in menus" :key="menu.id">
              <!-- 一级菜单的模板区域 -->
              <template #title>
                <!-- 图标 -->
                <i :class="icons[menu.id]"></i>
                <!-- 文本 -->
                <span>{{ menu.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/' + childrenItem.path + ''" v-for="childrenItem in menu.children"
                            :key="childrenItem.id">
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{ childrenItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 内容主体 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getMenus } from 'network/home'

export default {
  name: 'Home',
  data () {
    return {
      menus: null,
      icons: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-danju',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-tijikongjian',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created () {
    getMenus().then(res => {
      console.log(res)
      this.menus = res.data
    })
  },
  components: {},
  methods: {
    ...mapActions({ updateToken: 'updateToken' }),
    logout () {
      this.updateToken('')
      this.$router.push('/login')
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home, .el-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
