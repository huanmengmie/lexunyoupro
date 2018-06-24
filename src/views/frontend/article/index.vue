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
          <el-menu-item index="read">浏览量</el-menu-item>
          <el-menu-item index="like">喜欢量</el-menu-item>
          <el-cascader
            placeholder="请输入地址"
            :options="provinces"
            filterable
            clearable
            :props="props"
            @active-item-change = "handleProvinceChange"
            @change="filterByArea"
            style="top:.5rem"
          ></el-cascader>
        </el-menu>
        <div style="min-height:400px;margin-bottom:80px;" ref="showArea">
          <article-item v-for="item in showArticles" :key="item.id" :articleInfo="item"></article-item>
          <p style="margin-top: 20px;">
            <span v-if="showNext" @click="nextPage" style="cursor: pointer;text-decoration: underline;">继续观看</span>
            <span v-else>没有更多了...</span>
          </p>
        </div>
    </el-col>
  </el-row>
</template>

<script>
import ArticleItem from '@/components/frontend/articleItem'
import { fetchConstant } from '@/api/constant'
import { fetchList } from '@/api/article'
import { getCitys } from '@/api/city'

export default {
  mounted() {
    this.getTags()
    this.getArticles()
    this.setProvince()
  },
  components: {
    ArticleItem
  },
  computed: {
    showNext: function() {
      const num = this.listQuery.page * this.listQuery.limit
      if (num < this.listQuery.total) {
        return true
      } else {
        return false
      }
    }
  },
  data() {
    return {
      searchConditions: '',
      hasChoosed: [],
      origianlData: [],
      provinces: [],
      tagArray: [],
      showArticles: [],
      listQuery: {
        total: '',
        page: 1,
        limit: 4,
        simple: false,
        deleted: false,
        constantId: undefined,
        privinceId: undefined,
        cityId: undefined,
        text: undefined,
        sort: '-a.score,-a.publish_time'
      },
      props: { // 级联选择器属性
        value: 'basicCitysId',
        label: 'basicCitysName',
        children: 'citys'
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
    nextPage() {
      this.listQuery.page++
      const loading = this.$loading({
        target: this.$refs.showArea,
        text: '正在拼命加载中...'
      })
      fetchList(this.listQuery).then(res => {
        if (res.code === 20000) {
          const addList = res.data.list
          const temp = this.showArticles
          this.showArticles = temp.concat(addList)
        } else {
          this.$message({
            typs: 'info',
            message: '没有找到符合条件的内容，看看推荐吧！'
          })
        }
        loading.close()
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
          this.listQuery.total = res.data.total
        } else {
          this.$message({
            typs: 'info',
            message: '没有找到符合条件的内容，看看推荐吧！'
          })
        }
        loading.close()
      })
    },
    filterByArea(val) {
      this.listQuery.privinceId = val[0]
      this.listQuery.cityId = val[1]
      this.getArticles()
    },
    setProvince() {
      getCitys(undefined, 1).then(res => {
        const data = res.data.list
        data.forEach(item => {
          item.citys = []
        })
        this.provinces = data
      })
    },
    handleProvinceChange(val) { // 省市二级联动获取数据
      const item = this.getCascaderObj(val[0], this.provinces)
      getCitys(val[0], undefined).then(res => {
        item.citys = res.data.list
      })
    },
    getCascaderObj(val, opt) { // 通过id找到数组中的元素
      for (var item of opt) {
        if (item.basicCitysId === val) {
          return item
        }
      }
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
      } else if (key === 'read') {
        this.listQuery.sort = '-a.read_number'
      } else if (key === 'like') {
        this.listQuery.sort = '-a.like_number'
      }
      this.getArticles()
    },
    resetQuery() {
      this.listQuery = {
        page: 1,
        limit: 4,
        simple: false,
        deleted: false,
        constantId: undefined,
        privinceId: undefined,
        cityId: undefined,
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
