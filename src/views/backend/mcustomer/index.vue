<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户名'" v-model="listQuery.userName">
      </el-input>
        <el-date-picker
      v-model="listQuery.startTime"
      type="datetime"
      placeholder="选择开始时间">
      </el-date-picker>
        <el-date-picker
        v-model="listQuery.endTime"
        type="datetime"
        placeholder="选择结束时间">
      </el-date-picker> 
        
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="info" icon="el-icon-edit" @click="handleAddNewCustomer">创建新用户</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%" empty-text="无" :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column align="center" :label="'序号'" width="65" type="index">
      </el-table-column>
      <el-table-column width="150px" :label="'用户名称'">
        <template slot-scope="scope">
          <el-popover
            placement="bottom-start"
            width="150"
            trigger="hover">
            <img :src="scope.row.avatar">
            <span class="link-type" @click="handleUpdate(scope.row)" slot="reference">{{scope.row.userName}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" :label="'手机号'">
        <template slot-scope="scope">
          <span slot="reference">{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="210px" align="center" :label="'密码'">
        <template slot-scope="scope">
          <span>{{scope.row.password}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" :label="'性别'">
        <template slot-scope="scope">
          <el-tag>{{scope.row.sex }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" :label="'邮箱'">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="'角色'">
        <template slot-scope="scope">
          <span v-for="item in scope.row.roles" :key="item.id">{{ item.roleName }} </span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="'注册时间'">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="'最近修改时间'" sortable prop="date">
        <template slot-scope="scope">
          <span>{{scope.row.editTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="'账户可用'" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deleted | statusFilter">{{!scope.row.deleted}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'操作'" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.deleted!=true" size="mini" type="danger" @click="handleModifyStatus(scope.row,true)">拉黑
          </el-button>
          <el-button v-if="scope.row.deleted!=false" size="mini" type="success" @click="handleModifyStatus(scope.row,false)">启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="dataForm" :rules="addRule" ref="dataForm" label-width="100px">
        <el-form-item label="手机号" prop="phone" required>
          <el-input v-model="dataForm.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" required v-if="dialogStatus == 'create'">
          <el-input v-model="dataForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <template v-if="dialogStatus != 'create'">
          <el-form-item label="用户昵称" prop="userName" required>
            <el-input v-model="dataForm.userName" auto-complete="off" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex" required>
            <el-radio-group v-model="dataForm.sex">
              <el-radio label="保密"></el-radio>
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="mail" v-model="dataForm.email" auto-complete="off" placeholder="请输入邮箱地址"></el-input>
          </el-form-item>
          <el-form-item :label="'启用'" prop="deleted">
            <el-switch
              v-model="dataForm.deleted"
              active-text="否"
              active-color="#ff4949"
              inactive-text="是"
              inactive-color="#13ce66">
            </el-switch>
        </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogStatus == 'create'" @click="submitDataForm">确 定</el-button>
        <el-button type="primary" v-else @click="updateDataForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { updateScenery } from '@/api/scenery'
import { fetchList as getAllCustomer, addCustomer, updateCustomer } from '@/api/customer'
import { parseTime, textSubString } from '@/utils'
import { validateEmail, validatePhone } from '@/utils/validate'

export default {
  name: 'complexTable',
  data() {
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
    const validateEmailAddress = (rule, value, callback) => {
      if (validateEmail(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱地址'))
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogFormVisible: false,
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogStatus: '',
      dataForm: {
        userName: '',
        phone: '',
        password: '',
        sex: '保密',
        emial: '',
        deleted: false
      },
      addRule: {
        userName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        password: { required: true, message: '请输入密码', trigger: 'blur' },
        emial: [
          { validator: validateEmailAddress, trigger: 'blur' },
          { required: false }
        ]
      },
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        simple: false,
        userName: undefined,
        startTime: undefined,
        endTime: undefined
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        false: 'success',
        true: 'danger'
      }
      return statusMap[status]
    },
    textFilter(text) {
      return textSubString(text, 50)
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() { // 获取所有用户信息
      this.listLoading = true
      if (this.listQuery.startTime !== undefined) {
        this.listQuery.startTime = parseTime(this.listQuery.startTime)
      }
      if (this.listQuery.endTime !== undefined) {
        this.listQuery.endTime = parseTime(this.listQuery.endTime)
      }
      getAllCustomer(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      row.deleted = status
      updateScenery(row).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
      })
    },
    handleAddNewCustomer() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.restDataForm()
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    submitDataForm() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          const loading = this.$loading()
          addCustomer(this.dataForm).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.dataForm.id = res.newId
            this.list.unshift(this.dataForm)
            this.dialogFormVisible = false
          }).finally(() => {
            loading.close()
          })
        }
      })
    },
    handleUpdate(item) {
      this.dataForm = Object.assign({}, item, { password: undefined })
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    updateDataForm() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          const loading = this.$loading()
          updateCustomer(this.dataForm).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            for (const v of this.list) {
              if (v.id === this.dataForm.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.dataForm)
                break
              }
            }
            this.dialogFormVisible = false
          }).finally(() => {
            loading.close()
          })
        }
      })
    },
    restDataForm() {
      this.dataForm = {
        userName: '',
        phone: '',
        password: '',
        sex: '保密',
        emial: '',
        deleted: false
      }
    }
  }
}
</script>
