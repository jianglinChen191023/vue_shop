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
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"
                         @click="showSetRoleDialog(scope.row)"></el-button>
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
      title="添加用户"
      :visible.sync="isShowAdd"
      width="50%"
      @close="addDialogClose">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--  修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose">
      <el-form :model="editForm" ref="editFormRef"
               :rules="editFormRules" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleHandleClose">
      <div>
        <p>当前的用户: {{ userInfo.username }}</p>
        <p>当前的角色: {{ userInfo.role_name }}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsers,
  updateState,
  saveUser,
  getUserById,
  updateUserInfo,
  deleteUserInfoById,
  getAllRole,
  updateRoleByUserId
} from 'network/users'

export default {
  name: 'Users',
  data () {
    // 验证邮箱的规则
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    const checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }

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
      isShowAdd: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的用户规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            // 触发事件
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在 3-10 个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在 6-15 个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入用户邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入用户手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      /* 分配角色 */
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色
      roleList: {},
      // 已选中的角色 Id 值
      selectedRoleId: ''
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
    },
    // 监听添加对话框的关闭事件
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮, 添加新用户
    addUser () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        // 可以发起添加用户的请求
        saveUser(this.addForm)
          .then(res => {
            console.log(res.meta.status)
            if (res.meta.status !== 201) {
              this.$message.error('添加用户失败')
              return false
            }
            this.$message.success('添加用户成功')
            // 隐藏添加用户框
            this.isShowAdd = false
            // 重新获取用户列表数据
            this.getUsers2()
          })
          .catch(err => {
            this.$message.error('请求失败: ' + err)
          })
      })
    },
    // 展现编辑用户的对话框
    showEditDialog (id) {
      getUserById(id)
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('查询用户信息失败!')
          }

          this.editForm = res.data
          this.editDialogVisible = true
        })
    },
    // 监听修改用户对话框的关闭事件
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        // 发起修改用户信息的请求
        updateUserInfo(this.editForm.id, this.editForm.email, this.editForm.mobile)
          .then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('更新用户信息失败!')
            }

            // 隐藏对话框
            this.editDialogVisible = false
            // 刷新数据
            this.getUsers2()
            // 提示更新成功
            this.$message.success('更新用户信息成功!')
          })
      })
    },
    // 根据 id 删除用户
    deleteUserById (id) {
      // 弹框询问用户是否删除数据
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserInfoById(id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除用户失败!')
          }

          this.$message.success('删除用户成功!')
          // 刷新数据
          this.getUsers2()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /* 分配权限 */
    // 显示分配角色对话框
    showSetRoleDialog (userInfo) {
      this.userInfo = userInfo

      // 显示对话框之前, 获取所有角色数据并保存
      getAllRole()
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取角色失败!')
          }

          // 保存角色数据
          this.roleList = res.data
          this.setRoleDialogVisible = true
        })
    },
    // 分配角色对话框 确认按钮 事件
    updateRole () {
      if (!this.selectedRoleId) {
        return this.$message.error('请选中要分配的角色!')
      }

      updateRoleByUserId(this.userInfo.id, this.selectedRoleId)
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('分配角色失败!')
          }

          this.$message.success('分配角色成功!')
          this.getUsers2()
          this.setRoleDialogVisible = false
        })
    },
    // 监听分配角色对话框的关闭事件
    setRoleHandleClose () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style scoped>

</style>
