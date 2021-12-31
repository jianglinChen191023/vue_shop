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
        <!-- 搜索框与按钮 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <!-- 搜索框 -->
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <!-- 按钮 -->
          <el-col :span="4">
            <el-button type="primary">添加用户</el-button>
          </el-col>
        </el-row>

        <!-- 用户列表区域 -->
        <el-table :data="users" border stripe style="margin-top: 15px;font-size: 12px;">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini">{{ scope.mobile }}</el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              <!-- 分配角色按钮 -->
              <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </card>
  </div>
</template>

<script>
import Breadcrumb from 'components/common/breadcrumb/Breadcrumb'
import Card from 'components/common/card/Card'
import { getUsers } from 'network/users'

export default {
  name: 'Users',
  components: {
    Breadcrumb,
    Card
  },
  data () {
    return {
      users: '',
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0
    }
  },
  created () {
    getUsers(this.queryInfo).then(res => {
      this.users = res.data.users
      this.total = res.data.total
    })
  }
}
</script>

<style scoped>

</style>
