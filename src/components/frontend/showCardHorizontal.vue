<template>
  <div style="padding:10px;" class="clearfix">
    <el-row :gutter="20">
      <el-col :span="6">
        <router-link :to="{ name:'sceneryDetail', params:{id: info.sceneryInfo && info.sceneryInfo.id}}">
          <img :src="info.sceneryInfo && info.sceneryInfo.avatar" style="width:100%;height:100%;">
        </router-link>
          
      </el-col>
      <el-col :span="18" style="position:relative;">
        <div class="clearfix">
          <span style="float:left;">{{info.customer.userName}}</span>
          <el-rate
              v-model="info.sceneryScore"
              disabled
              show-score
              text-color="#ff9900"
              style="float:right;">
          </el-rate>
        </div>
        <blockquote class="content">{{ content }}</blockquote>
        <time class="time">{{ info.publishTime }}</time>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { textSubString } from '@/utils'
export default {
  props: ['info'],
  computed: {
    content() {
      return textSubString(this.info.content, 50)
    }
  }
}
</script>

<style scoped>
.clearfix::after {
  display: table;
  content: "";
  clear: both;
}

.content {
  text-align: left;
  text-indent: 2rem;
  height: 4rem;
  font-size: 1rem;
  line-height: 2rem;
  color: #999;
}

.time {
  position: absolute;
  bottom: 0;
  right: 1rem;
  font-size: 0.8rem;
  color: #c3c3c3;
}

</style>
