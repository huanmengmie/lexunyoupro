<template>
<header class="main-header" :class="{'main-header-fixed':headerFixed}">
    <el-row>
        <el-col :span="4" :offset="3">
            <router-link :to="{path:'/'}" tag="h1" style="font-size: 2rem; padding-top: 0.5rem;color: white;cursor:pointer;">乐寻游</router-link>
        </el-col>
        <el-col :span="10" :offset="6">
            <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            text-color="#C3EAFA"
            background-color="#6AB6EF"
            active-text-color="#fff"
            :router="useRouter"
            style="border-bottom:0">
              <el-menu-item index="/index">首页</el-menu-item>
              <el-menu-item index="/scenery">热门景点</el-menu-item>
              <el-menu-item index="/article">交流心得</el-menu-item>
              <el-menu-item index="/console/dashboard">控制台</el-menu-item>
              <el-menu-item index="/aboutus" @click="activeIndex='/aboutus'">关于</el-menu-item>
              <el-menu-item index="/register" v-if="avatar == ''">
                  <span @click="openDialog('login')">登录/</span>
                  <router-link :to="{path:'/register'}" tag="span">注册</router-link>
              </el-menu-item>
              <el-menu-item index="" v-else>
                <el-dropdown class="avatar-container" trigger="click">
                  <div class="avatar-wrapper">
                    <img class="user-avatar" :src="avatar+'?imageView2/1/w/30/h/30'" style="width:30px;height:30px;border-radius:50%;">
                    <i class="el-icon-caret-bottom"></i>
                  </div>
                  <el-dropdown-menu class="user-dropdown" slot="dropdown">
                    <router-link class="inlineBlock" to="/myinfo">
                      <el-dropdown-item>
                        个人信息
                      </el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided>
                      <span style="display:block;" @click="logout">退出</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-menu-item>
            </el-menu>
        </el-col>
    </el-row>
    <el-dialog :title="'登录'" :visible.sync="dialogFormVisible" :append-to-body="true">
      <el-form :model="form" :rules="rules" style="padding-right:5rem;" ref="loginForm">
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone" required>
          <el-input v-model.number="form.phone" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password" required>
          <el-input v-model="form.password" type="password" auto-complete="off" clearable @keyup.native.enter="submitForm"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
</header>
</template>

<script>
import { validatePhone } from '@/utils/validate'

export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!validatePhone(value)) {
        this.legalPhone = false
        callback(new Error('请输入正确的手机号'))
      } else {
        this.legalPhone = true
        callback()
      }
    }
    return {
      headerFixed: false,
      activeIndex: '',
      useRouter: true,
      isLogin: false,
      dialogFormVisible: false,
      avatar: this.$store.state.user.avatar,
      form: {
        phone: '',
        password: ''
      },
      formLabelWidth: '120px',
      rules: {
        phone: [
          { validator: checkPhone, trigger: 'blur', required: true }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.setActiveIndex()
  },
  watch: {
    '$route': 'setActiveIndex'
  },
  methods: {
    setActiveIndex() {
      let path = this.$route.path
      const reg = /\/\w+/g
      path = reg.exec(path)[0]
      this.activeIndex = path || '/index'
    },
    handleScroll() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      var offsetTop = document.querySelector('.main-header').offsetTop
      if (scrollTop > offsetTop) {
        this.headerFixed = true
      } else {
        this.headerFixed = false
      }
    },
    openDialog(title) {
      this.form.title = title
      this.dialogFormVisible = true
    },
    submitForm() {
      const _self = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            spinner: 'el-icon-loading',
            text: '正在登录，请稍候...'
          })
          _self.$store.dispatch('Login', this.form).then(() => {
            _self.$store.dispatch('GetInfo').then(res => {
              this.avatar = this.$store.state.user.avatar
            })
          }).finally(() => {
            loading.close()
            this.dialogFormVisible = false
          })
        }
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(res => {
        this.$message({
          tyep: 'info',
          message: '已退出'
        })
        this.avatar = ''
      })
    }
  }
}
</script>

<style>
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.main-header {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #6AB6EF;
  box-shadow: 0 0 5px 5px #6ab6ef;
}
.main-header-fixed {
  z-index: 3000;
  opacity: 0.6;
}
.clear:after{
  display: table;
  content: "";
  clear: both;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 30px;
        height: 30px;
        border-radius: 15px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
