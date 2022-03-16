<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 表单区域 -->
      <el-form :model="updateForm" :rules="updateFormRules"
               ref="updateFormRef" label-width="100px" label-position="top">
        <!-- 标签页区域 -->
        <el-tabs @tab-click="tabClicked" :before-leave="beforeTabLeave" v-model="activeIndex" :tab-position="'left'">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="updateForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="updateForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="updateForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="updateForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                  expand-trigger="hover"
                  v-model="updateForm.goods_cat"
                  :options="cateList"
                  :props="cateProps"
                  @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的 item 项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 图片要上传到的 API 地址
                 handlePreview: 处理图片预览效果
                 handleRemove: 处理移除图片的操作-->
            <el-upload
                :file-list="uploadFileList"
                :on-success="handleSuccess"
                :headers="headerObj"
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="updateForm.goods_introduce"></quill-editor>
            <!-- 添加按钮 -->
            <el-button type="primary" class="btnAdd" @click="update">修改商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog
        title="图片预览"
        :visible.sync="previewDialogVisible"
        width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import { getCateList } from 'network/cate'
import { getGoodsById, updateGoods } from 'network/listUpdate'
import _ from 'lodash'

export default {
  name: 'ListUpdate',
  data () {
    return {
      // steps 步骤条和 tabs 标签页共用, 实现的联动
      activeIndex: '0',
      updateForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        // 商品的参数, 包含 静态属性和动态参数
        attrs: []
      },
      // 表单规则对象
      updateFormRules: {
        goods_name: [{
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        }],
        goods_price: [{
          required: true,
          message: '请输入商品价格',
          trigger: 'blur'
        }, {
          required: true,
          message: '请输入商品价格',
          trigger: 'blur'
        }],
        goods_weight: [{
          required: true,
          message: '请输入商品重量',
          trigger: 'blur'
        }],
        goods_number: [{
          required: true,
          message: '请输入商品数量',
          trigger: 'blur'
        }],
        goods_cat: [{
          required: true,
          message: '请选择商品分类',
          trigger: 'blur'
        }]
      },
      // 商品分类列表
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 参数面板 > 动态参数列表数据
      manyTableData: [],
      onlyTableData: [],
      // 上传图片的 URL 地址
      uploadURL: 'https://lianghj.top:8888/api/private/v1/upload',
      // 图片上传组件的 headers 请求头对象
      headerObj: {
        authorization: this.$store.getters.token
      },
      // 图片预览 URL 地址
      previewPath: '',
      // 控制图片预览对话框的显示与隐藏
      previewDialogVisible: false,
      uploadFileList: []
    }
  },
  created () {
    this.getCateList()
    this.handleParams()
  },
  methods: {
    // 处理参数
    handleParams () {
      // 目的: 为表单对象赋值

      // 获取商品 id
      // console.log(this.$route.query.id)
      const id = this.$route.query.id
      // 根据 id 获取商品信息
      getGoodsById(id).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品数据失败!')
        }

        const data = res.data
        // console.log(data)
        data.goods_cat = data.goods_cat.length !== 0 ? data.goods_cat.split(',') : []
        data.goods_cat.map((item, i) => {
          data.goods_cat[i] = parseInt(item)
        })
        // console.log(data.goods_cat)
        // console.log(data.goods_cat)
        // 赋值给表单对象
        this.updateForm = data
        console.log(this.updateForm)

        // 动态参数 和 静态属性
        this.updateForm.attrs.forEach(item => {
          if (item.attr_sel === 'only') {
            this.onlyTableData.push({
              attr_id: item.attr_id,
              attr_vals: item.attr_value
            })
          } else {
            this.manyTableData.push({
              attr_id: item.attr_id,
              attr_vals: item.attr_value.length !== 0 ? item.attr_value.split(' ') : []
            })
          }
        })
        // console.log(this.manyTableData)
        // console.log(this.onlyTableData)

        this.updateForm.pics.forEach(item => {
          this.uploadFileList.push({
            name: '已上传文件',
            url: item.pics_big_url
          })
        })
      })
    },
    getCateList () {
      getCateList({}).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类数据失败!')
        }

        this.cateList = res.data
      })
    },
    // 级联选择器选中项变化, 会触发这个函数
    handleChange () {
      // 只能选择三级分类
      if (this.updateForm.goods_cat.length !== 3) {
        this.updateForm.goods_cat = []
      }
    },
    // 切换标签之前的钩子
    beforeTabLeave (activeName, oldActiveName) {
      // console.log('即将离开的标签页名字是: ' + oldActiveName)
      // console.log('即将进入的标签页名字是: ' + activeName)
      // return false
      if (oldActiveName === '0' && this.updateForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类!')
        return false
      }
    },
    // tab 被选中时触发
    tabClicked () {
    },
    // 处理图片预览效果
    handlePreview (file) {
      // console.log(file)
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 处理移除图片的操作
    handleRemove (file) {
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中, 找到这个图片对应的索引值
      const i = this.updateForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的 slice 方法, 把图片信息对象, 从 pics 数组中移除
      this.updateForm.pics.splice(i, 1)
    },
    // 监听图片上传成功的事件
    handleSuccess (response) {
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象, push 到数组中
      this.updateForm.pics.push(picInfo)
    },
    // 添加商品功能
    update () {
      // 获取表单对象并校验
      this.$refs.updateFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项!')
        }

        // 执行添加的业务逻辑
        // 1. 深拷贝表单数组
        const updateFormClone = _.cloneDeep(this.updateForm)
        // 2. 将 goods_cat 数组中所有元素拼接为一个字符串 , 号隔开
        updateFormClone.goods_cat = updateFormClone.goods_cat.join(',')
        // 2.1 检查
        // console.log(updateFormClone.goods_cat)
        // 3. 处理动态参数 和 静态属性
        updateFormClone.attrs = []
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }

          updateFormClone.attrs.push(newInfo)
        })

        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }

          updateFormClone.attrs.push(newInfo)
        })
        // 3.1 检查
        // console.log(updateFormClone.attrs)
        console.log(updateFormClone)
        // 4. 请求修改商品
        // 商品名称必须是唯一的
        updateGoods(this.$route.query.id, updateFormClone).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('修改商品失败!')
          }

          this.$message.success('修改商品成功!')
          this.$router.push('/goods')
        })
      })
    }
  }
}
</script>

<style scoped>
.el-steps {
  margin: 15px 0;
  font-size: 13px;
}

.el-checkbox {
  margin: 0 5px 0 0 !important;
}

.previewImg {
  width: 100%
}

.ql_editor {
  min-height: 300px;
}

.btnAdd {
  margin-top: 15px;
}

</style>
