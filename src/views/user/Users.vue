<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索框与按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers2">
            <el-button slot="append" icon="el-icon-search" @click="getUsers2"></el-button>
          </el-input>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="isShowAdd = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="users" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
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

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="isShowAdd"
      width="50%">
      <!-- 内容主体区域 -->
      <span>这是一段信息</span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
            <el-button @click="isShowAdd = false">取 消</el-button>
            <el-button type="primary" @click="isShowAdd = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, updateState } from 'network/users'

export default {
  name: 'Users',
  data () {
    return {
      users: [],
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 1
      },
      total: 0,
      // 控制添加对话框的显示与隐藏
      isShowAdd: false
    }
  },
  created () {
    this.getUsers2()
  },
  methods: {
    // 获取用户数据
    getUsers2 () {
      getUsers(this.queryInfo).then(res => {
        this.users = res.data.users
        this.total = res.data.total
      })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsers2()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getUsers2()
    },
    // 监听 Switch 状态的改变
    userStateChange (row) {
      updateState(row.id, row.mg_state).then(res => {
        if (res.meta.status !== 200) {
          row.mg_state = !row.mg_state
          this.$message.error('更新用户状态失败')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
