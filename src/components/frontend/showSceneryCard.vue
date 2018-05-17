<template>
  <el-card :body-style="{ padding: '0.2rem' }">
    <div class="image-box">
      <img :src="info.avatar" class="image">
      <section class="clear">
        <address class="time">{{ info.province.basicCitysName }}-{{ info.province.basicCitysName }}</address>
        <time class="time" style="float:right;">{{ info.publishTime }}</time>
      </section>
    </div>
    <div class="center">
      <span>{{ info.sceneryName }}</span>
      <span style="float:right;position:relative;">3240<i class="iconfont" style="font-size:20px;color:red;">&#xe613;</i></span>
      <el-rate v-if="isScore"
        v-model="info.sceneryScore"
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
      <section class="intro-section">{{ info.sceneryIntro }}</section>
    </div>
    <div class="bottom clearfix">
      <el-tag type="primary" size="small" style="float:left">{{ info.constant.value }}</el-tag>
      <router-link :to="{ name:'sceneryDetail', params:{ id: info.id }}">
        <el-button type="text" class="button">查看详情</el-button>
      </router-link>
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
  color: white;
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

.image-box{
  position: relative;
}

.image-box > section {
  position: absolute;
  bottom: 0;
  background: black;
  width: 100%;
  opacity: .5;
  padding: 0.2rem;
}

.image {
  width: 100%;
  height: 255px;
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
