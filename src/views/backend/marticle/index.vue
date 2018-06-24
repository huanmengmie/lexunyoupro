<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'标题'" v-model="listQuery.text">
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
      <el-select clearable class="filter-item" filterable style="width: 130px" v-model="listQuery.constantId" :placeholder="'相关标签'">
        <el-option v-for="item in tagArray" :key="item.id" :label="item.value" :value="item.id">
        </el-option>
      </el-select>
      
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <router-link style="margin-right:15px;" :to="{ path:'/marticle/add'}">
        <el-button type="info" icon="el-icon-edit">发布新文章</el-button>
      </router-link>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%" empty-text="您暂未发布随笔" :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column align="center" :label="'序号'" width="65" type="index">
      </el-table-column>
      <el-table-column width="150px" :label="'标题'">
        <template slot-scope="scope">
          <el-popover
            placement="bottom-start"
            width="350"
            trigger="hover">
            <img :src="scope.row.avatar" style="width:100%;">
            <span class="link-type" @click="handleUpdate(scope.row.id)" slot="reference">{{scope.row.title}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column min-width="300px" align="center" :label="'简介'">
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            width="600"
            trigger="hover"
            :content="scope.row.intro">
            <span slot="reference">{{scope.row.intro | textFilter}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="'作者'">
        <template slot-scope="scope">
          <span>{{scope.row.customer && scope.row.customer.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" :label="'网友评分'">
        <template slot-scope="scope">
          <span>{{scope.row.score}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" :label="'浏览量'">
        <template slot-scope="scope">
          <span>{{scope.row.readNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" :label="'喜欢数'">
        <template slot-scope="scope">
          <span>{{scope.row.likeNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="'相关标签'">
        <template slot-scope="scope">
          <el-tag>{{scope.row.constant && scope.row.constant.value }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="'发布日期'" sortable prop="date">
        <template slot-scope="scope">
          <span>{{scope.row.publishTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" :label="'已发布'" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deleted | statusFilter">{{!scope.row.deleted}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'操作'" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button v-if="scope.row.deleted!=true" size="mini" type="danger" @click="handleModifyStatus(scope.row,true)">草稿
          </el-button>
          <el-button v-if="scope.row.deleted!=false" size="mini" type="success" @click="handleModifyStatus(scope.row,false)">发布
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchList, updateArticle } from '@/api/article'
import { fetchConstant } from '@/api/constant'
import { parseTime, textSubString } from '@/utils'

// arr to obj ,such as { CN : "China", US : "USA" }

export default {
  name: 'complexTable',
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        simple: false,
        authorId: this.$store.state.user.id,
        text: undefined,
        constantId: undefined,
        startTime: undefined,
        endTime: undefined
      },
      tagArray: [],
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
    },
    typeFilter(type) {
      return this.tagArray[type]
    }
  },
  created() {
    this.getList()
    this.getTags()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.listQuery.startTime !== undefined) {
        this.listQuery.startTime = parseTime(this.listQuery.startTime)
      }
      if (this.listQuery.endTime !== undefined) {
        this.listQuery.endTime = parseTime(this.listQuery.endTime)
      }
      fetchList(this.listQuery).then(res => {
        if (res.code === 20000) {
          this.list = res.data.list
          this.total = res.data.total
        } else {
          this.$message({
            type: 'info',
            message: '您还没有发布过文章'
          })
        }
        this.listLoading = false
      })
    },
    getTags() {
      const conditions = {
        simple: true,
        deleted: false,
        type: '1001'
      }
      fetchConstant(conditions).then(res => {
        this.tagArray = res.data.list
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
      updateArticle(row).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
      })
    },
    handleUpdate(id) {
      this.$router.push({ name: 'MarticleEdit', params: { id: id }})
    }
  }
}
</script>

<style scoped>
.filter-container{
  margin-bottom: 15px;
}
</style>
