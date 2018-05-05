<template>
  <div style="padding:10px;" class="clearfix">
    <el-row :gutter="20">
      <el-col :span="6">
          <img :src="info.url" style="width:100%;height:100%;">
      </el-col>
      <el-col :span="18" style="position:relative;">
        <div class="clearfix">
          <span style="float:left;">{{info.name}}</span>
          <el-rate
              v-model="info.grade"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}" style="float:right;">
          </el-rate>
        </div>
        <blockquote class="content">{{ content }}</blockquote>
        <time class="time">{{ info.createTime }}</time>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['info'],
  computed: {
    content() {
      if (this.info.content.length > 50) {
        return this.info.content.substring(0, 50) + '...'
      } else {
        return this.info.content
      }
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
