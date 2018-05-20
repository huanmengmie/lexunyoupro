<template>
  <el-row>
    <el-col :span="20">
      <div class="article-item-author">
        <img :src="articleInfo.customer && articleInfo.customer.avatar">
        <span>{{ articleInfo.customer && articleInfo.customer.userName}}</span>
        <span style="padding:0 1rem;">{{ articleInfo.publishTime}}</span>
        <el-tag type="primary" size="small">{{ articleInfo.constant && articleInfo.constant.value }}</el-tag>
      </div>
      <article class="article-content">
        <router-link :to="{ name: 'articleDetail', params:{id:articleInfo.id}}" tag="p" class="article-title">{{ articleInfo.title}}</router-link>
        <section>{{ text }}</section>
      </article>
      <ul class="article-num clear">
        <li><svg-icon icon-class="star"></svg-icon><span>{{ articleInfo.score }}</span></li>
        <li><i class="iconfont">&#xe600;</i><span>15</span></li>
        <li><i class="iconfont">&#xe613;</i><span>30</span></li>
      </ul>
    </el-col>
    <el-col :span="4">
      <img :src="articleInfo.avatar" class="article-avatar">
    </el-col>
  </el-row>
</template>

<script>
import { textSubString } from '@/utils'
export default {
  props: ['articleInfo'],
  computed: {
    text() {
      return textSubString(this.articleInfo.intro, 120)
    }
  }
}
</script>

<style scoped>
.el-row{
  text-align: left;
  position: relative;
  padding:1rem;
  height: 11rem;
  border-bottom: 1px dashed #e8e8e8;
}
.article-item-author{
  position: relative;
  padding-bottom: .5rem;
}
.article-item-author > img{
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  position: relative;
  top: .5rem;
}


.article-title {
  text-align: center;
  text-decoration: underline;
  padding-bottom: 3px;
  cursor: pointer;
}

.article-content{
  padding: 0 1rem .5rem 0;
}
.article-content section {
  text-indent: 2rem;
}
.article-num {
  position: absolute;
  bottom: 1rem;
  right: 20rem;
  list-style: none;
}
.article-num li{
  float: left;
  padding: 0 .3rem;
}
.article-avatar {
  width:100%;
  height:130px;
}
</style>
