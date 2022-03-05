<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意: 只允许第三级分类设置相关参数!" type="warning" :closable="false" show-icon></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <!--  选择商品分类的级联选择框  -->
          <div class="block">
            <span class="demonstration">选择商品分类: </span>
            <el-cascader
                expand-trigger="hover"
                v-model="selectedCateKeys"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"></el-cascader>
          </div>
        </el-col>
      </el-row>

      <!-- tab 页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick ">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染 Tag 标签 -->
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable
                        @close="handleClose(index, scope.row)">
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性
          </el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable>{{ item }}</el-tag>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">

      <!-- 添加参数的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
        :title="'修改' + titleText"
        :visible.sync="updateDialogVisible"
        width="50%"
        @close="updateDialogClosed">

      <!-- 修改参数的表单 -->
      <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="100px"
               class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="updateForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList } from 'network/cate'
import { getParamsList, addParams, getParams, updateParams, deleteParams, updateParamsValue } from 'network/params'

export default {
  name: 'Params',
  data () {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      // tabs 标签页 - 当前选中的标签名
      // 被激活的标签名称
      activeName: 'many',
      // 动态属性的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 表单验证规则
      addFormRules: {
        attr_name: [
          {
            required: 'true',
            message: '请输入参数名称!',
            trigger: 'blur'
          }
        ]
      },
      // 控制修改对话框的显示与隐藏
      updateDialogVisible: false,
      // 修改参数的表单数据对象
      updateForm: {
        attr_name: ''
      },
      // 表单验证规则
      updateFormRules: {
        attr_name: [
          {
            required: 'true',
            message: '请输入参数名称!',
            trigger: 'blur'
          }
        ]
      },
      debounce: function () {
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    getCateList () {
      getCateList().then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败!')
        }

        this.$message.success('获取商品分类成功!')
        this.cateList = res.data
      })
    },
    // 级联选择框选中项有变化，会触发这个函数
    handleChange () {
      this.getParamsList()
    },
    // tabs 标签页 - 点击标签触发该函数
    // tabs 标签页点击事件的处理函数
    handleTabClick () {
      this.getParamsList()
    },
    getParamsList () {
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return false
      }

      // 证明选中的是三级分类
      // 根据所选分类的 id, 和当前所选的面板，获取对应的数据
      getParamsList(this.cateId, this.activeName).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('获取参数列表失败!')
        }

        // 处理参数
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制文本框的显示与隐藏
          item.inputVisible = false
          // 文本框中输入的值
          item.inputValue = ''
        })

        // this.$message.success('获取参数列表成功!')
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      })
    },
    // 监听添加对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数
    addParams () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        addParams(this.cateId, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        }).then(res => {
          if (res.meta.status !== 201) {
            this.$message.error('添加参数失败!')
          }

          this.$message.success('添加参数成功!')
          this.addDialogVisible = false
          this.getParamsList()
        })
      })
    },
    // 点击按钮, 展示修改对话框
    showEditDialog (attrId) {
      // 查询当前参数的信息
      getParams(this.cateId, attrId, { attr_set: this.activeName }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('查询参数失败!')
        }

        // 表单对象
        this.updateForm = res.data
        // 显示修改对话框
        this.updateDialogVisible = true
      })
    },
    // 监听修改对话框的关闭事件
    updateDialogClosed () {
      // 重置表单
      this.$refs.updateFormRef.resetFields()
    },
    // 修改参数
    updateParams () {
      this.$refs.updateFormRef.validate(valid => {
        if (!valid) return
        updateParams(this.cateId, this.updateForm.attr_id, {
          attr_name: this.updateForm.attr_name,
          attr_sel: this.activeName
        }).then(res => {
          if (res.meta.status !== 200) {
            this.$message.error('修改参数失败!')
          }

          this.$message.success('修改参数成功!')
          this.updateDialogVisible = false
          this.getParamsList()
        })
      })
    },
    // 删除参数
    deleteParams (attrId) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteParams(this.cateId, attrId).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除参数失败!')
          }

          this.$message.success('删除参数成功!')
          this.getParamsList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 文本框失去焦点，或按下 Enter 都会触发
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }

      // 如果没有 return, 则证明输入的内容, 需要做后续的处理
      row.attr_vals.push(row.inputValue)
      this.saveAttrVals(row)
    },
    // 保存参数项
    saveAttrVals (row) {
      // 发起请求保存
      updateParamsValue(this.cateId, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }).then(res => {
        if (res.meta.status !== 200) {
          // 请求失败撤回
          row.attr_vals.pop()
          row.inputValue = ''
          return this.$message.error('修改参数项失败!')
        }

        row.inputValue = ''
        row.inputVisible = false
        this.$message.success('修改参数项成功!')
      })
    },
    // 点击按钮展示文本输入框
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $netTick: 当页面上元素被重新渲染之后, 才会调用回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应参数和选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 如果按钮需要被禁用, 则返回true, 否则返回false
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }

      return false
    },
    // 当前选中的三级分类的 id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }

      return null
    },
    // 对话框标题文本
    titleText () {
      let titleName = ''
      if (this.activeName === 'many') {
        titleName = '动态参数'
      } else {
        titleName = '静态参数'
      }

      return titleName
    }
  }
}
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 5px;
}

.input-new-tag {
  width: 120px
}
</style>
