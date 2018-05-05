<template>
  <el-row>
    <el-col :span="20">
      <div class="article-item-author">
        <img :src="articleInfo.author.avatar">
        <span>{{ articleInfo.author.userName}}</span>
        <span style="padding:0 1rem;">{{ articleInfo.publishTime}}</span>
      </div>
      <article class="article-content">
        <a class="article-title" href="javascript:void(0)">{{ articleInfo.articleTitle}}</a>
        <section>{{ articleInfo.intro }}</section>
      </article>
      <ul class="article-num clear">
        <li><i class="el-icon-view"></i><span>{{ articleInfo.readNumber }}</span></li>
        <li><i class="iconfont">&#xe600;</i><span>{{ articleInfo.commentNumber }}</span></li>
        <li><i class="iconfont">&#xe613;</i><span>{{ articleInfo.likeNumber }}</span></li>
      </ul>
    </el-col>
    <el-col :span="4">
      <img :src="articleInfo.avatar" class="article-avatar">
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['articleInfo']
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
  text-decoration: none;
  color: #333;
  display: inherit;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
}
.article-title:hover {
  text-decoration-line: underline;
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
  list-style: none;
}
.article-num li{
  float: left;
  padding: 0 .3rem;
}
.article-avatar {
  width:100%;
  height:100%;
}
</style>
