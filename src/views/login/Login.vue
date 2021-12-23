<template>
  <div class="login">
    <div class="login_container">
      <div class="login_box">
        <!-- 头像框 -->
        <avatar-box></avatar-box>
        <!-- 动态绑定 model 表单数据对象, 动态绑定 rules 表单校验对象(el-form-item 标签定义属性 prop 来指定校验名称<对象格式: 属性名_校验名称: []>), 属性 ref 定义组件(this.$refs.组件名: 获取组件元素) -->
        <el-form :model="loginForm"
                 :rules="rules"
                 ref="loginFormRef"
                 label-width="0px"
                 class="login_form">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <!-- v-model 指令(表单绑定), 修饰符: lazy(失去焦点或回车时才更新)、number(输入的内容自动转为数字类型)、trim(过滤左右两边的空格) -->
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <!-- v-on 指令(事件监听), 缩写: @, click 监听用户的点击 -->
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import AvatarBox from 'components/content/login/avatarbox/AvatarBox'

import { getLogin } from 'network/login'

import { mapActions } from 'vuex'

export default {
  name: 'Login',
  components: {
    AvatarBox
  },
  data () {
    return {
      /* 表单数据 */
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      /* 表单验证规则 */
      rules: {
        username: [
          {
            required: true,
            message: '请输入登录名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入登录密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions({
      addToken: 'addToken'
    }),
    reset () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate((valid, invalidFields) => {
        if (!valid) {
          return false
        } else {
          getLogin(this.loginForm.username, this.loginForm.password).then(res => {
            if (res.meta.status === 200) {
              this.$message.success('登录成功')
              // 记住 token
              window.localStorage.setItem('token', res.data.token)
              this.addToken(res.data.token)
              // 跳转至后台首页
              this.$router.push('home')
            } else {
              this.$message.error('登录失败')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
}

.login_container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

</style>
