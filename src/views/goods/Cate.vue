<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <zk-table class="zkTable"
                ref="table"
                sum-text="sum"
                index-text="#"
                :data="cateList"
                :columns="columns"
                :stripe="props.stripe"
                :border="props.border"
                :show-header="props.showHeader"
                :show-summary="props.showSummary"
                :show-row-hover="props.showRowHover"
                :show-index="props.showIndex"
                :tree-type="props.treeType"
                :is-fold="props.isFold"
                :expand-type="props.expandType"
                :selection-type="props.selectionType">
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen"></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showUpdateDialog(scope.row.cat_id)">编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)">删除
          </el-button>
        </template>
      </zk-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, ,10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--  添加分类对话框  -->
    <el-dialog
      title="提示"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed">

      <!-- 添加分类的表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules"
               ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类: ">
          <!-- options 用来指定数据源
               props: 用来指定配置对象
               clearable: 设置输入框可清空
               change-on-select: 允许选择任意一级的选项 -->
          <el-cascader
            change-on-select
            clearable
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!--  编辑分类的表单  -->
    <el-dialog
      title="编辑分类"
      :visible.sync="updateDialogVisible"
      width="50%">

      <!-- 编辑分类表单 -->
      <el-form ref="updateFormRef" :model="updateForm" :rules="updateRules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="updateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="updateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList, addCate, getCateById, updateCate, deleteCateById } from 'network/cate'

export default {
  name: 'Cate',
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表, 默认为空
      cateList: [],
      // 总数据条数
      total: 0,
      // 为 table 指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 表示 将当前列定义为模板列
        type: 'template',
        // 表示 当前这一列使用模板名称
        template: 'isok'
      }, {
        label: '排序',
        // 表示 将当前列定义为模板列
        type: 'template',
        // 表示 当前这一列使用模板名称
        template: 'order'
      }, {
        label: '操作',
        // 表示 将当前列定义为模板列
        type: 'template',
        // 表示 当前这一列使用模板名称
        template: 'opt'
      }],
      props: {
        // 是否为多选类型表格
        selectionType: false,
        // 是否为展开行类型表格（为 True 时，需要添加名称为 '$expand' 的作用域插槽
        // , 它可以获取到 row, rowIndex)
        expandType: false,
        // 是否显示数据索引
        showIndex: true,
        // 是否显示纵向边框
        border: true,
        // 鼠标悬停时，是否高亮当前行
        showRowHover: false
      },
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的 Id
        cat_pid: 0,
        // 分类的等级, 默认要添加的1级分类
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的 Id 数组
      selectedKeys: [],
      // 要修改的数据 id - 编辑分类
      updateId: '',
      // 控制对话框的显示与隐藏 - 编辑分类
      updateDialogVisible: false,
      // 表单数据 - 编辑分类
      updateForm: {
        cat_name: ''
      },
      // 表单验证规则 - 编辑分类
      updateRules: {
        cat_name: [
          {
            required: 'true',
            message: '分类名称不能为空!',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    getCateList () {
      getCateList(this.queryInfo).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('获取商品分类失败!')
        }

        this.$message.success('获取商品分类成功!')
        // 把数据列表,赋值给 cateList
        this.cateList = res.data.result
        console.log(this.cateList)
        // 为总数据条数赋值
        this.total = res.data.total
      })
    },
    // 接听 pageSize 改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮, 展示 添加分类 对话框
    showAddCateDialog () {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示出对话框
      this.addCateDialogVisible = true
    },
    // 选择项发生变化触发这个函数
    parentCateChanged () {
      // 如果 selectedKeys 数组中 length 大于0, 证明选中的父级分类
      // 反之，就说明没有选中如何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的 Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的 Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      }
    },
    // 获取父级分类的数据列表
    getParentCateList () {
      getCateList().then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('获取父级分类数据失败!')
        }

        this.parentCateList = res.data
      })
    },
    // 监听 添加分类对话框 的关闭事件, 重置表单数据
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击按钮, 添加新的分类
    addCate () {
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) return
        addCate(this.addCateForm).then(res => {
          if (res.meta.status !== 201) {
            return this.$message.error('添加分类失败!')
          }

          this.$message.success('添加分类成功!')
          this.getCateList()
          this.addCateDialogVisible = false
        })
      })
    },
    // 显示对话框 - 编辑分类
    showUpdateDialog (id) {
      getCateById(id).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('查询分类失败!')
        }

        this.updateDialogVisible = true
        this.updateForm = res.data
      })
    },
    // 提交表单数据 - 编辑分类
    updateCate () {
      this.$refs.updateFormRef.validate(valid => {
        if (valid) {
          updateCate(this.updateForm.cat_id, this.updateForm.cat_name).then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('编辑分类失败!')
            }

            this.$message.success('编辑分类成功!')
            this.updateDialogVisible = false
            this.getCateList()
          })
        }
      })
    },
    // 删除分类
    deleteCate (id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCateById(id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除分类失败!')
          }

          this.$message.success('删除分类成功!')
          this.getCateList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
.zkTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%
}
</style>
