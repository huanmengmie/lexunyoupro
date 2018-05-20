<template>
    <el-row>
      <el-col :offset="8" :span="8">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="头像">
            <el-col :span="8" :offset="8">
              <el-upload
                class="avatar-uploader"
                draggable
                :action="qiniu"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :on-change="handleAvatarChange"
                :before-upload="beforeAvatarUpload">
                <img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
          </el-form-item>
          <el-form-item label="昵称" prop="userName">
            <el-input v-model="ruleForm.userName" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone" required>
            <el-input v-model="ruleForm.phone" clearable></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="ruleForm.sex">
              <el-radio label="保密"></el-radio>
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码" prop="password" required>
            <el-input type="password" v-model="ruleForm.password" clearable @change="changePass = true"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" v-show="changePass" prop="checkPass" required>
            <el-input type="password" v-model="ruleForm.checkPass" clearable></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" required>
            <el-input type="text" v-model="ruleForm.email" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">确认更新</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
</template>

<script>
import { fetchCustomer, updateCustomer } from '@/api/customer'
import { validateEmail, validatePhone } from '@/utils/validate'

export default {
  data() {
    const validateEmailAddress = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱号'))
      } else {
        if (validateEmail(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱地址'))
        }
      }
    }
    const checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        if (validatePhone(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的手机号'))
        }
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      qiniu: this.$store.state.constant.qiniu,
      changePass: false,
      ruleForm: {
        id: this.$store.state.user.id,
        userName: '',
        password: '',
        checkPass: '',
        phone: '',
        avatar: '',
        email: '',
        sex: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        email: [
          { validator: validateEmailAddress, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.setCustomer()
  },
  methods: {
    setCustomer() {
      fetchCustomer(this.$store.state.user.id).then(res => {
        this.ruleForm = res.data
        this.ruleForm.checkPass = res.data.password
      })
    },
    handleAvatarChange(file) {
      this.ruleForm.avatar = URL.createObjectURL(file.raw)
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.avatar = res.picUrl
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading()
          updateCustomer(this.ruleForm).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            loading.close()
          })
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed;
  border-radius: 50%;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  border-radius: 50%;
}
.el-form {
  margin-top: 3rem;
}
</style>

