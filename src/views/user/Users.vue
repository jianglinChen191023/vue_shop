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
      users: [],
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 1
      },
      total: 0
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
    }
  }
}
</script>

<style scoped>
.el-pagination {
  margin-top: 15px;
}
</style>
