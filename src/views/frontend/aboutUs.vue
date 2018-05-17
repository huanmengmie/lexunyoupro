<template>
  <div>
    <head-banner :bannerUrl="bannerUrl" :info="info" style="margin-top:4rem;"></head-banner>
    <el-row>
      <el-col :span="6" :offset="3" style="padding:0 10px;">
        <img :src="logoUrl">
      </el-col>
      <el-col :span="12">
        <p>团队名称：乐寻游</p>
        <p>团队宣言：乐在寻找不一样的旅游体验</p>
        <p>团队logo介绍：</p>
        <article>
          旧字不封边，体现了我们不循规蹈矩，而是破旧立新，
          旧字紧跟+号也是迎合‘互联网+’精神和思想,不old而odd。
          这也突出了们项目的创新之处--民族小众定制旅游，这也标志着“互联网+旅游”新时代的来临。
          An odd choice，我们的团队叫乐寻游，乐在寻找不一样的旅游体验。
        </article>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headBanner from '@/components/frontend/headBanner'
export default {
  components: {
    headBanner
  },
  data() {
    return {
      bannerUrl: 'http://oyd1cktti.bkt.clouddn.com/aboutus.jpg',
      logoUrl: require('@/assets/img/lexunyoulogo.jpg'),
      info: {
        english: 'A happy journey',
        chinese: '乐寻游 —— 与你畅游世界',
        intro: '游山玩水，其乐无穷'
      }
    }
  }
}
</script>

<style scoped>
.el-row{
  margin: 6rem 0;
}
.el-col{
  text-align: left;
  color: #a9a9a9;
  line-height: 2em;
}
.el-col article{
  text-indent: 2rem;
}
</style>
