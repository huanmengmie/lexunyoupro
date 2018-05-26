<template>
  <el-carousel :interval="4000" type="card" height="500px">
    <el-carousel-item>
      <h3>用户角色分配</h3>
      <el-form :model="userToRole" :rules="userToRoleRules" ref="userToRoleForm" label-width="250px">
        <el-form-item label="用户名" prop="userId" required>
          <el-select v-model="userToRole.userId" @click.native.once="initCustomers" placeholder="请选择用户">
            <el-option v-for="item in customers" :key="item.id" :label="item.userName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleId" required>
          <el-select v-model="userToRole.roleId" 
            @click.native.once="initRoles"
            filterable
            placeholder="请选择角色">
            <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitUserToRole" type="primary">提交</el-button>
          <el-button @click="resetForm('userToRoleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-carousel-item>
    <el-carousel-item>
      <h3>新角色</h3>
      <el-form :model="newRole" :rules="newRoleRules" ref="newRoleForm" label-width="250px">
        <el-form-item label="角色详情" prop="roleName" required>
          <el-input v-model="newRole.roleName" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="detail" required>
          <el-input v-model="newRole.detail" placeholder="角色服务对象"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitNewRole" type="primary">提交</el-button>
          <el-button @click="resetForm('newRoleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-carousel-item>
    <el-carousel-item>
      <h3>角色授权</h3>
      <el-form :model="roleToPermission" :rules="roleToPermissionRules" ref="roleToPermissionForm" label-width="250px">
        
        <el-form-item label="角色" prop="roleId" required>
          <el-select v-model="userToRole.roleId" 
            @click.native.once="initRoles"
            filterable
            placeholder="请选择角色">
            <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="permissionId" required>
          <el-select v-model="userToRole.userId" @click.native.once="initPermissions" placeholder="请选择权限">
            <el-option v-for="item in permissions" :key="item.id" :label="item.permissionName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitRoleToPermission" type="primary">提交</el-button>
          <el-button @click="resetForm('userToRoleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { fetchList } from '@/api/customer'
import { fetchRoles, fetchPermissions, addRole, addUtr, addPermission } from '@/api/permission'

export default {
  data() {
    return {
      listQuery: {
        sort: '+id',
        simple: true
      },
      customers: [],
      roles: [],
      permissions: [],
      userToRole: {
        userId: '',
        roleId: ''
      },
      userToRoleRules: {
        userId: { required: true, message: '请选择用户', trigger: 'blur' },
        roleId: { required: true, message: '请选择角色', trigger: 'blur' }
      },
      newRole: {
        roleName: '',
        detail: ''
      },
      newRoleRules: {
        roleName: { required: true, message: '请输入角色名称', trigger: 'blur' },
        detail: { required: true, message: '请输入角色详情', trigger: 'blur' }
      },
      roleToPermission: {
        roleId: '',
        permissionId: ''
      },
      roleToPermissionRules: {
        roleId: { required: true, message: '请选择角色名称', trigger: 'blur' },
        permissionId: { required: true, message: '请选择角色权限', trigger: 'blur' }
      }
    }
  },
  methods: {
    initCustomers() {
      fetchList(this.listQuery).then(res => {
        this.customers = res.data.list
      })
    },
    initRoles() {
      fetchRoles().then(res => {
        this.roles = res.data
      })
    },
    initPermissions() {
      fetchPermissions().then(res => {
        this.permissions = res.data
      })
    },
    submitUserToRole() {
      this.$refs.userToRoleForm.validate(valid => {
        if (valid) {
          const loading = this.$loading()
          addUtr(this.userToRole).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.resetForm('userToRoleForm')
          }).finally(() => {
            loading.close()
          })
        }
      })
    },
    submitNewRole() {
      this.$refs.newRoleForm.validate(valid => {
        if (valid) {
          const loading = this.$loading()
          addRole(this.newRole).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.newRole.id = res.newId
            this.roles.push(this.newRole)
            this.resetForm('newRoleForm')
          }).finally(() => {
            loading.close()
          })
        }
      })
    },
    submitRoleToPermission() {
      this.$refs.roleToPermissionForm.validate(valid => {
        if (valid) {
          const loading = this.$loading()
          addPermission(this.roleToPermission).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.resetForm('roleToPermissionForm')
          }).finally(() => {
            loading.close()
          })
        }
      })
    },
    resetForm(name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style scoped>
.el-carousel {
  margin-top: 5rem;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 20px;
  text-align: center;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item{
  background-color: #d3dce6;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.el-select, .el-input {
  width: 400px;
}
</style>
