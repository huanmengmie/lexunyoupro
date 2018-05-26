<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="dashboard-container">
          <div class="dashboard-text">name:{{name}}</div>
          <div class="dashboard-text">roles:<span v-for='role in roles' :key='role'>{{role}} </span></div>
        </div>
      </el-col>
      <el-col :span="8">
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
                <img v-if="ruleForm.avatar" :src="tempFile" class="avatar">
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
          <el-form-item label="邮箱" prop="email" required>
            <el-input type="text" v-model="ruleForm.email" clearable placeholder="请完善邮箱"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    return {
      qiniu: this.$store.state.constant.qiniu,
      ruleForm: {
        id: this.$store.state.user.id,
        userName: '',
        phone: '',
        avatar: '',
        email: '',
        sex: ''
      },
      tempFile: '',
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
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  mounted() {
    this.setCustomer()
  },
  methods: {
    setCustomer() {
      fetchCustomer(this.$store.state.user.id).then(res => {
        this.ruleForm = res.data
        this.tempFile = res.data.avatar
      })
    },
    handleAvatarChange(file) {
      this.tempFile = URL.createObjectURL(file.raw)
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
.dashboard-container{
  margin: 30px;
}
.dashboard-text {
  font-size: 30px;
  line-height: 46px;
}
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
