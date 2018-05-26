<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="handleUtrFilter" style="width: 200px;" class="filter-item" :placeholder="'标题'" v-model="utrListQuery.text">
      </el-input>
        <el-date-picker
      v-model="utrListQuery.startTime"
      type="datetime"
      placeholder="选择开始时间">
    </el-date-picker>
      <el-date-picker
      v-model="utrListQuery.endTime"
      type="datetime"
      placeholder="选择结束时间">
    </el-date-picker>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleUtrFilter">搜索</el-button>
    </div>
    <el-tabs type="card">
      <el-tab-pane label="用户-角色">
        <el-table :key='1' :data="utrList" v-loading="utrListLoading" element-loading-text="给我一点时间" border fit highlight-current-row
          style="width: 100%" empty-text="无">
          <el-table-column align="center" :label="'序号'" width="65" type="index">
          </el-table-column>
          <el-table-column width="150px" :label="'用户名'">
            <template slot-scope="scope">
              <span>{{scope.row.user && scope.row.user.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" :label="'联系方式'">
            <template slot-scope="scope">
              <span>{{scope.row.user && scope.row.user.phone}}</span>
            </template>
          </el-table-column>
           <el-table-column width="150px" :label="'角色'">
            <template slot-scope="scope">
              <span>{{scope.row.role && scope.row.role.roleName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'角色描述'">
            <template slot-scope="scope">
              <span>{{scope.row.role && scope.row.role.detail}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" :label="'添加时间'">
            <template slot-scope="scope">
              <span>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" :label="'有效权限'" width="100" fixed="right">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.deleted"
                active-text="否"
                active-color="#ff4949"
                inactive-text="是"
                inactive-color="#13ce66"
                @change="updateUtrStatus(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleUtrSizeChange" @current-change="handleUtrCurrentChange" :current-page="utrListQuery.page" :page-sizes="[10,20,30, 50]" :page-size="utrListQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="utrTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="角色-权限" @click.native.once="test">
        <el-table :key='2' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
          style="width: 100%" empty-text="无">
          <el-table-column align="center" :label="'序号'" width="65" type="index">
          </el-table-column>
          <el-table-column width="150px" :label="'角色'">
            <template slot-scope="scope">
              <span>{{scope.row.role && scope.row.role.roleName}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" :label="'角色描述'">
            <template slot-scope="scope">
              <span>{{scope.row.role && scope.row.role.detail}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'权限详情'">
            <template slot-scope="scope">
              <span>{{scope.row.permission && scope.row.permission.permissionName}}</span>
            </template>
          </el-table-column>
          <el-table-column width="300px" align="center" :label="'权限描述'">
            <template slot-scope="scope">
              <span>{{scope.row.permission && scope.row.permission.detail}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" :label="'添加时间'">
            <template slot-scope="scope">
              <span>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" :label="'有效权限'" width="100" fixed="right">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.deleted"
                active-text="否"
                active-color="#ff4949"
                inactive-text="是"
                inactive-color="#13ce66"
                @change="updateStatus(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="utrListQuery.page" :page-sizes="[10,20,30, 50]" :page-size="utrListQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { fetchUtrList, updateUtr, fetchRtpList, updateRtp } from '@/api/permission'
import { parseTime } from '@/utils'

const baseQuery = {
  page: 1,
  limit: 20,
  sort: '+id',
  simple: false,
  text: ''
}

export default {
  name: 'complexTable',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: Object.assign({}, baseQuery),
      utrList: null,
      utrTotal: null,
      utrListLoading: true,
      utrListQuery: Object.assign({}, baseQuery)
    }
  },
  created() {
    this.getUtrList()
    this.getList()
  },
  methods: {
    getUtrList() {
      this.utrListLoading = true
      if (this.utrListQuery.startTime !== undefined) {
        this.utrListQuery.startTime = parseTime(this.utrListQuery.startTime)
      }
      if (this.utrListQuery.endTime !== undefined) {
        this.utrListQuery.endTime = parseTime(this.utrListQuery.endTime)
      }
      fetchUtrList(this.utrListQuery).then(response => {
        this.utrList = response.data.list
        this.total = response.data.total
        this.utrListLoading = false
      })
    },
    handleUtrFilter() {
      this.utrListQuery.page = 1
      this.getUtrList()
    },
    handleUtrSizeChange(val) {
      this.utrListQuery.limit = val
      this.getUtrList()
    },
    handleUtrCurrentChange(val) {
      this.utrListQuery.page = val
      this.getUtrList()
    },
    updateUtrStatus(item) {
      updateUtr(item).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
      })
    },
    getList() {
      this.listLoading = true
      if (this.listQuery.startTime !== undefined) {
        this.listQuery.startTime = parseTime(this.listQuery.startTime)
      }
      if (this.listQuery.endTime !== undefined) {
        this.listQuery.endTime = parseTime(this.listQuery.endTime)
      }
      fetchRtpList(this.listQuery).then(response => {
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
    updateStatus(item) {
      updateRtp(item).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
      })
    }
  }
}
</script>
