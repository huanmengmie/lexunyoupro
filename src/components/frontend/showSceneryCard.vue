<template>
  <el-card :body-style="{ padding: '0.2rem' }">
    <div class="image-box">
      <img :src="info.avatar" class="image">
      <section class="clear">
        <address class="time">{{ info.province && info.province.basicCitysName }}-{{ info.city && info.city.basicCitysName }}</address>
        <time class="time" style="float:right;">{{ info.publishTime | timeFilter }}</time>
      </section>
    </div>
    <div class="center">
      <span style="float:left;position:relative;">
        <svg-icon icon-class="eye" style="font-size:20px;"></svg-icon>
        {{ info.readNumber }}
      </span>
      <span>{{ info.sceneryName }}</span>
      <span style="float:right;position:relative;">{{ info.likeNumber }}
        <svg-icon icon-class="like" style="font-size:20px;"></svg-icon>
      </span>
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
      <el-tag type="primary" size="small" style="float:left">{{ info.constant && info.constant.value }}</el-tag>
      <router-link :to="{ name:'sceneryDetail', params:{ id: info.id }}">
        <el-button type="text" class="button">查看详情</el-button>
      </router-link>
    </div>
  </el-card>
</template>

<script>
import { formatTime } from '@/utils'
export default {
  props: ['info', 'isScore'],
  filters: {
    timeFilter(text) {
      return formatTime(text)
    }
  },
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
