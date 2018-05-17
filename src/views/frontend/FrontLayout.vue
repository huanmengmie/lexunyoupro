<template>
  <section class="app-main">
		<my-header></my-header>
    <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <router-view></router-view>
    </transition>
		<my-footer></my-footer>
  </section>
</template>

<script>
import myHeader from '@/components/common/myHeader'
import myFooter from '@/components/common/myFooter'

export default {
  components: {
    myHeader,
    myFooter
  }
}
</script>
