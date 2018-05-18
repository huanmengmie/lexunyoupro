<template>
    <div>
        <p class="type">热门景点</p>
        <ul>
            <li v-for="item in scenerys" :key="item.id">
              <el-popover
                placement="bottom-start"
                width="300"
                trigger="hover"
                :content="item.sceneryIntro">
                <router-link :to="{ name:'sceneryDetail',params:{id:item && item.id} }" slot="reference">
                  <el-badge value="hot" class="item">
                    {{item.sceneryName}}
                  </el-badge>
                </router-link>
              </el-popover>
              <p class="baseinfo"> <span><svg-icon icon-class="user"/>{{ item.customer.userName }}</span> <time> {{ item.publishTime }} </time></p>
            </li>
        </ul>
        <p class="type">热门文章</p>
        <ul>
          <li v-for="item in articles" :key="item.id">
            <el-popover
                placement="bottom-start"
                width="300"
                trigger="hover"
                :content="item.intro">
              <router-link :to="{ name:'articleDetail',params:{id:item && item.id} }" slot="reference">
                <el-badge value="hot" class="item">
                  {{ item.title}}
                </el-badge>
              </router-link>
            </el-popover>
            <p class="baseinfo"> <span><svg-icon icon-class="user"/>{{ item.customer.userName }}</span> <time> {{ item.publishTime }} </time></p>
          </li>
        </ul>
    </div>
</template>

<script>
import { fetchList as fetchScenerys } from '@/api/scenery'
import { fetchList as fetchArticles } from '@/api/article'

const baseQuery = {
  limit: '7',
  page: '1',
  deleted: false,
  simple: false
}

export default {
  data() {
    return {
      scenerys: [],
      articles: []
    }
  },
  mounted() {
    this.setScenery()
    this.setArticle()
  },
  methods: {
    setScenery() {
      const queryVo = Object.assign({}, baseQuery, {
        sort: '-si.scenery_score,-si.publish_time'
      })
      fetchScenerys(queryVo).then(res => {
        this.scenerys = res.data.list
      })
    },
    setArticle() {
      const queryVo = Object.assign({}, baseQuery, {
        sort: '-a.publish_time'
      })
      fetchArticles(queryVo).then(res => {
        this.articles = res.data.list
      })
    }
  }
}
</script>

<style scoped>
ul {
  text-align: left;
  margin: 5px 20px;
  list-style: none;
  cursor: pointer;
}

.el-badge:hover {
  text-decoration: underline;
  color: #c3c3c3;;
}

.baseinfo {
  font-size: 0.8rem;
  color: #c3c3c3;
  padding: 5px;
}

.baseinfo time {
  margin-left: 20px;
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}
.type {
  text-align: left;
  margin: 5px 20px;
  color: #409efd;
  font-size: 20px;
  border-left: 3px solid;
  padding-left: 10px;
}
</style>
