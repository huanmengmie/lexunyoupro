<template>
  <el-card :body-style="{ padding: '0.2rem' }">
    <img :src="info.url" class="image">
    <div class="center">
      <span>{{ info.name }}</span>
      <!-- <img src="@/assets/img/like.png" style="position: relative;top: .5rem;"> -->
      <span style="float:right;position:relative;">{{info.hotNumber}}<i class="iconfont" style="font-size:20px;color:red;">&#xe613;</i></span>
      <el-rate v-if="isScore"
        v-model="info.grade"
        disabled
        show-score
        text-color="#ff9900"
        score-template="{value}">
      </el-rate>
      <el-rate v-else
        v-model="info.grade"
        disabled
        show-text>
      </el-rate>
      <section class="intro-section">{{ info.intro }}</section>
    </div>
    <div class="bottom clearfix">
      <time class="time">{{ info.createTime }}</time>
      <el-button type="text" class="button">查看详情</el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  props: ['info', 'isScore'],
  data() {
    return {}
  }
}
</script>

<style scoped>
.intro-section {
  overflow: hidden;
  text-overflow: ellipsis;
  width: 22rem;
  white-space: nowrap;
  color: #999;
}
.center {
  padding:0.5rem 1rem;
  line-height: 2rem;
}

.time {
  font-size: 0.8rem;
  color: #c3c3c3;
  float: left;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  margin: 0 1rem 0.5rem;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
