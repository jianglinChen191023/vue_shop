<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
                    v-for="(item1, index1) in scope.row.children"
                    :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, index2) in item1.children"
                        :key="item2.id">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="deleteRightById(scope.row, item2.id)">{{
                        item2.authName
                      }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id"
                            closable @close="deleteRightById(scope.row, item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!--<pre>-->
            <!--  {{ scope.row }}-->
            <!--</pre>-->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="openUpdateDialog(scope.row.id)">
              编辑
            </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoleById(scope.row.id)">删除
            </el-button>
            <!-- 分配权限 -->
            <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 修改角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="updateDialogVisible"
      width="50%"
      @close="updateHandleClose()">
      <el-form ref="updateFormRef" :model="updateFormData" :rules="updateRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="updateFormData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="updateFormData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addHandleClose()">
      <el-form ref="addFormRef" :model="addFormData" :rules="addRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addFormData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addFormData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList, deleteRightById, getRoleById, updateRoleById, deleteRoleById, addRole } from 'network/roles'

export default {
  name: 'Roles',
  data () {
    return {
      // 角色列表
      rolesList: [],
      /* 修改角色对话框 */
      // 是否隐藏修改角色对话框
      updateDialogVisible: false,
      // 修改对话框表单数据
      updateFormData: {},
      // 修改对话框校验规则
      updateRules: {
        roleName: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }]
      },
      /* 添加角色对话框 */
      // 是否隐藏修改角色对话框
      addDialogVisible: false,
      // 修改对话框表单数据
      addFormData: {},
      // 修改对话框校验规则
      addRules: {
        roleName: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    // 获取所有的权限
    this.getRolesList()
  },
  methods: {
    getRolesList () {
      getRolesList()
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取角色列表失败!')
          }

          this.rolesList = res.data
          this.$message.success('获取角色列表成功!')
        })
    },
    // 根据 Id 删除对应的权限
    deleteRightById (role, rightId) {
      // 弹框提示用户删除
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRightById(role.id, rightId).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除权限失败!')
          }

          this.$message.success('删除权限成功!')
          // 更新数据
          role.children = res.data
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 监听打开修改对话框
    openUpdateDialog (id) {
      // 根据 Id 请求角色数据
      getRoleById(id).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色信息失败!')
        }

        // 显示编辑对话框
        this.updateDialogVisible = true
        // 保存数据
        this.updateFormData = res.data
      })
    },
    // 监听关闭修改对话框
    updateHandleClose () {
      // 重置表单
      this.$refs.updateFormRef.resetFields()
    },
    // 修改角色信息并提交
    updateRole () {
      this.$refs.updateFormRef.validate(valid => {
        if (!valid) return
        // 请求修改角色信息
        updateRoleById(this.updateFormData.roleId, this.updateFormData.roleName, this.updateFormData.roleDesc).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('修改角色信息失败!')
          }

          this.$message.success('修改角色信息成功')
          this.updateDialogVisible = false
          this.getRolesList()
        })
      })
    },
    // 根据 Id 删除角色
    deleteRoleById (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoleById(id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除角色失败!')
          }

          this.$message.success('删除角色成功!')
          // 刷新数据
          this.getRolesList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 监听关闭添加对话框
    addHandleClose () {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },
    // 添加角色信息
    addRole () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        // 请求添加角色信息
        addRole(this.addFormData).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('添加角色信息失败!')
          }

          this.$message.success('添加角色信息成功')
          this.updateDialogVisible = false
          this.getRolesList()
        })
      })
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
