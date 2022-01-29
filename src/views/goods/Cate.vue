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
          <el-button type="primary">添加分类</el-button>
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
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
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
  </div>
</template>

<script>
import { getCateList } from 'network/cate'

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
    }
  }
}
</script>

<style scoped>
.zkTable {
  margin-top: 15px;
}
</style>
