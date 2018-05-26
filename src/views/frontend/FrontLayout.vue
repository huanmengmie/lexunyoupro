<template>
  <section class="app-main">
		<my-header></my-header>
    <transition name="fade" mode="out-in">
      <router-view style="min-height:35rem;"></router-view>
    </transition>
		<my-footer></my-footer>
     <el-tooltip placement="top" content="go top">
      <back-to-top transitionName="fade" :customStyle="myBackToTopStyle" :visibilityHeight="300" :backPosition="50"></back-to-top>
    </el-tooltip>
  </section>
</template>

<script>
import myHeader from '@/components/common/myHeader'
import myFooter from '@/components/common/myFooter'
import BackToTop from '@/components/BackToTop'

export default {
  components: {
    myHeader,
    myFooter,
    BackToTop
  },
  data() {
    return {
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    }
  }
}
</script>
