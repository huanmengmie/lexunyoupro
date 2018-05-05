<template>
<div>
  <my-header></my-header>
  <el-row style="margin-top:4rem;">
    <el-col :offset="3" :span="18">
        <el-input
            class="clearfix"
            placeholder="请输入关键词"
            prefix-icon="el-icon-search"
            v-model="searchConditions">
        </el-input>
        <div class="clear article-tags">
            <el-checkbox-group
                v-model="choosedType">
                <el-checkbox v-for="item in articleTypes" :label="item.id" :key="item.id" border style="margin-bottom:1rem;">{{item.value}}</el-checkbox>
            </el-checkbox-group>
        </div>
        <div>
          <article-item v-for="item in showArticles" :key="item.id" :articleInfo="item"></article-item>
        </div>
    </el-col>
  </el-row>
  <my-footer></my-footer>
</div>
</template>

<script>
import myHeader from '@/components/common/myHeader'
import myFooter from '@/components/common/myFooter'
import ArticleItem from '@/components/frontend/articleItem'
export default {
  mounted() {
    this.getArticleType()
    this.getArticles()
  },
  components: {
    ArticleItem,
    myHeader,
    myFooter
  },
  data() {
    return {
      searchConditions: '',
      choosedType: [],
      articleTypes: [],
      showArticles: []
    }
  },
  methods: {
    getArticleType() {
      this.$http.get('/api/article')
        .then((res) => {
          this.articleTypes = res.data
          console.log(res.data)
        })
    },
    getArticles() {
      this.$http.get('/api/articleItems')
        .then((res) => {
          this.showArticles = res.data
          console.log(res.data)
        })
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
    padding: 1rem .5rem 0rem;
}
</style>
