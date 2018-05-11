<template>
<div>
   <el-button type="primary" @click="handleCreate">添加新标签</el-button>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">

    <el-table-column align="center" label="ID" width="65"  v-loading="loading" type="index"
    element-loading-text="请给我点时间！">

    </el-table-column>

    <el-table-column width="110px" align="center" label="key">
      <template slot-scope="scope">
        <span>{{scope.row.key}}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="180px" label="value">
      <template slot-scope="scope">
        <span>{{scope.row.value}}</span>
      </template>
    </el-table-column>

   <el-table-column width="280px" align="center" label="Date">
      <template slot-scope="scope">
        <span>{{scope.row.publishTime}}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="启用" width="150">
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.deleted"
          active-text="否"
          active-color="#ff4949"
          inactive-text="是"
          inactive-color="#13ce66"
          @change="update(scope.row)"
          disabled>
        </el-switch>
      </template>
    </el-table-column>

    <el-table-column label="操作" width="100px" fixed="right">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleUpdate(scope.row)">修改</el-button>
      </template>
    </el-table-column>

  </el-table>
  <div class="pagination-container">
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 500px; margin-left:100px;'>
        <el-form-item :label="'标签分类'" prop="type">
          <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
            <el-option v-for="item in  tabMapOptions" :key="item.key" :label="item.label" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'key值'" prop="key">
          <el-input v-model="temp.key"></el-input>
        </el-form-item>
        <el-form-item :label="'value值'" prop="value">
          <el-input v-model="temp.value"></el-input>
        </el-form-item>
        <el-form-item :label="'启用'" prop="deleted">
            <el-switch
              v-model="temp.deleted"
              active-text="否"
              active-color="#ff4949"
              inactive-text="是"
              inactive-color="#13ce66">
            </el-switch>
        </el-form-item>
        <el-form-item :label="'发布日期'" prop="publishTime">
          <el-date-picker v-model="temp.publishTime" type="datetime" placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-else type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
import { fetchConstant, addConstant, updateConstant } from '@/api/constant'
import { parseTime } from '@/utils'

export default {
  props: {
    type: {
      type: String,
      default: '1001'
    }
  },
  data() {
    return {
      tabMapOptions: [
        { label: '文章类型', key: '1001' },
        { label: '景点标签', key: '1002' }
      ],
      list: null,
      total: null,
      listQuery: {
        page: 1,
        limit: 10,
        type: this.type,
        sort: '+id'
      },
      loading: false,
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: undefined,
        publishTime: new Date(),
        key: '',
        type: '',
        value: '',
        deleted: false
      },
      rules: {
        type: [{ required: true, message: '请选择文章类型', trigger: 'change' }],
        publishTime: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
        value: [{ required: true, message: '请输入value值', trigger: 'blur' }]
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'info'
      }
      return statusMap[status]
    },
    timeFilter(time) {
      return parseTime(time)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      fetchConstant(this.listQuery).then(response => {
        // this.list = response.data.items
        this.total = response.data.total
        this.list = response.data.data
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        publishTime: new Date(),
        key: '',
        type: '',
        value: '',
        deleted: false
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.publishTime = parseTime(this.temp.publishTime)
          addConstant(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.publishTime = new Date(this.temp.publishTime)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.publishTime = parseTime(this.temp.publishTime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateConstant(this.temp).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

