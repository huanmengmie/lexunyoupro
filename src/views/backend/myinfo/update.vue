<template>
    <el-row style="margin-top:4rem;">
        <el-col :offset="3" :span="18">
            <el-steps :active="activeIndex" simple style="margin-top:3rem;">
              <el-step title="1、验证手机号" icon="el-icon-phone-outline"></el-step>
              <el-step title="2、输入新密码" icon="el-icon-edit"></el-step>
            </el-steps>
            <el-alert title="" center v-show="countDown > 0" style="margin-bottom:10px;">验证码错误，请{{ countDown }}s后重试</el-alert>
            <div v-if="activeIndex == 1" class="contents">
                <el-form :model="checkPhone" status-icon :rules="rules1" ref="phoneForm" label-width="100px">
                    <el-form-item label="手机号" prop="phone">
                        <el-input type="text" v-model.number="checkPhone.phone" @blur.once="ifErrorCode" auto-complete="off" ref="phone"></el-input>
                    </el-form-item>
                    <el-form-item label="验证" prop="checkProcess" ref="checkProcess" required>
                        <el-slider v-model="checkPhone.checkProcess" :disabled="forbidSlider" :show-tooltip="false" @change="checkSuccess"></el-slider>
                    </el-form-item>
                    <el-form-item label="验证码" prop="inputCode" ref="inputCode" v-show="checkPhone.checkProcess === 100 && legalPhone">
                        <el-input type="text" v-model.number="checkPhone.inputCode" minlength="6" maxlength="6" auto-complete="off" @change="verifyCode" placeholder="请输入6位验证码"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="info" @click="goNext" :disabled="toSecondDisabled" style="margin-left:16rem;">下一步</el-button>
            </div>
            <div v-else class="contents">
                <el-form :model="customer" status-icon :rules="rules2" ref="dataForm" label-width="100px">
                    <el-form-item label="新密码" prop="password">
                        <el-input type="password" v-model="customer.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPassword">
                      <el-input type="password" v-model="customer.checkPassword" @keyup.enter.native="submitForm('dataForm')" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="submitForm('dataForm')">提交</el-button>
                      <el-button @click="resetForm('dataForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import { validatePhone } from '@/utils/validate'
import { updateCustomer } from '@/api/customer'
import { setCookie, getCookie } from '@/utils/auth'

export default {
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!validatePhone(value)) {
        this.legalPhone = false
        callback(new Error('请输入正确的手机号'))
      } else {
        this.legalPhone = true
        callback()
      }
    }
    const checkCode = (rule, value, callback) => {
      var reg = /^\d{6}$/
      if (!reg.test(value)) {
        callback(new Error('请输入6位验证码'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.customer.checkPassword !== '') {
          this.$refs.dataForm.validateField('checkPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.customer.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      activeIndex: 1,
      legalPhone: false,
      countDown: 0,
      forbidSlider: false,
      checkPhone: {
        phone: '',
        checkProcess: 0,
        inputCode: ''
      },
      toSecondDisabled: true,
      customer: {
        password: '',
        checkPassword: '',
        id: this.$store.state.user.id
      },
      rules1: {
        phone: [
          { validator: checkPhone, trigger: 'blur', required: true }
        ],
        checkPassword: [
          { required: true, message: '拖动滑块以完成验证' }
        ],
        inputCode: [
          { validator: checkCode, trigger: 'blur', required: true }
        ]
      },
      rules2: {
        password: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        checkPassword: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ]
      }
    }
  },
  methods: {
    checkSuccess() {
      if (!this.legalPhone) {
        this.$refs.phone.focus()
        this.checkPhone.checkProcess = 0
        this.$message('请先完善手机号')
      } else {
        this.ifErrorCode()
      }
      if (this.legalPhone && this.checkPhone.checkProcess === 100) {
        this.$message('验证码已发送至您的手机请注意查收')
      }
    },
    verifyCode() {
      if (this.checkPhone.inputCode === 123456) {
        this.toSecondDisabled = false
      } else if (!this.ifErrorCode()) {
        this.countDown = 60
        setCookie(this.checkPhone.phone, new Date())
        this.timeOut()
      }
    },
    ifErrorCode() {
      const end = getCookie(this.checkPhone.phone.toString())
      if (end !== undefined) {
        const diff = (new Date(end) - new Date() + 60000) / 1000
        if (diff > 0) {
          this.countDown = parseInt(diff)
          this.timeOut()
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    timeOut() {
      this.$refs.checkProcess.resetField()
      this.$refs.inputCode.resetField()
      this.forbidSlider = true
      const _self = this
      var test = setInterval(() => {
        if (_self.countDown > 0) {
          _self.countDown--
        } else {
          _self.forbidSlider = false
        }
      }, 1000)
      setTimeout(() => {
        clearInterval(test)
      }, 100000)
    },
    goNext() {
      this.activeIndex = 2
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading()
          this.customer.phone = this.checkPhone.phone
          updateCustomer(this.customer).then(res => {
            this.$message({
              type: 'info',
              message: '密码修改成功，请重新登录!'
            })
            this.$store.dispatch('LogOut')
            this.$router.push({ path: '/login' })
          }).finally(() => {
            loading.close()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.contents{
  border: 1px dashed #e8e8e8;
  height: 25rem;
  margin-bottom: 2rem;
  padding: 5rem 25rem;
}
</style>
