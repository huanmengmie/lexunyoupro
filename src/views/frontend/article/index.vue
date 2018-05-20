<template>
  <el-row style="margin-top:4rem;">
    <el-col :offset="3" :span="18">
        <el-input
            class="clearfix"
            placeholder="请输入关键词"
            @keyup.enter.native="getArticles"
            prefix-icon="el-icon-search"
            v-model="listQuery.text">
        </el-input>
        <div class="clear article-tags">
            <el-checkbox-group
              @change="chooseTag"
              v-model="hasChoosed">
              <el-checkbox v-for="item in tagArray" :label="item.id" :key="item.id" border style="margin-bottom:1rem;">{{item.value}}</el-checkbox>
            </el-checkbox-group>
        </div>
        <el-menu :default-active="'all'" class="el-menu-demo" mode="horizontal" @select="scenerySort">
          <el-menu-item index="all">综合</el-menu-item>
          <el-menu-item index="time">发布时间</el-menu-item>
          <el-menu-item index="score">网友评分</el-menu-item>
        </el-menu>
        <div style="min-height:400px;" ref="showArea">
          <article-item v-for="item in showArticles" :key="item.id" :articleInfo="item"></article-item>
        </div>
    </el-col>
  </el-row>
</template>

<script>
import ArticleItem from '@/components/frontend/articleItem'
import { fetchConstant } from '@/api/constant'
import { fetchList } from '@/api/article'

export default {
  mounted() {
    this.getTags()
    this.getArticles()
  },
  components: {
    ArticleItem
  },
  data() {
    return {
      searchConditions: '',
      hasChoosed: [],
      origianlData: [],
      tagArray: [],
      showArticles: [],
      listQuery: {
        page: 1,
        limit: 10,
        simple: false,
        deleted: false,
        constantId: undefined,
        text: undefined,
        sort: '-a.score,-a.publish_time'
      }
    }
  },
  methods: {
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
    getArticles() {
      const loading = this.$loading({
        target: this.$refs.showArea,
        text: '正在拼命加载中...'
      })
      fetchList(this.listQuery).then(res => {
        if (res.code === 20000) {
          this.showArticles = res.data.list
        } else {
          this.$message({
            typs: 'info',
            message: '没有找到符合条件的内容，看看推荐吧！'
          })
        }
        loading.close()
      })
    },
    chooseTag() {
      if (this.hasChoosed.length > 1) {
        this.hasChoosed.shift()
      }
      if (this.hasChoosed.length > 0) {
        this.listQuery.constantId = this.hasChoosed[0]
        this.getArticles()
      }
    },
    scenerySort(key) {
      if (key === 'all') {
        this.resetQuery()
      } else if (key === 'time') {
        this.listQuery.sort = '-a.publish_time'
      } else if (key === 'score') {
        this.listQuery.sort = '-a.score'
      }
      this.getArticles()
    },
    resetQuery() {
      this.listQuery = {
        page: 1,
        limit: 10,
        simple: false,
        deleted: false,
        constantId: undefined,
        text: undefined,
        sort: '-a.score,-a.publish_time'
      }
    }
  }
}
</script>

<style scoped>
.el-input {
    width: 40%;
    margin: 1rem 5rem 1rem 50%;
}
.el-checkbox-group {
    float: left;
}
.article-tags {
    border: 1px solid #e8e8e8;
    padding: 1rem 2rem 0rem;
}
</style>
