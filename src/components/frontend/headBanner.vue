<template>
  <div>
    <div class="top-banner">
      <img :src="bannerUrl" style="width:100%;height:100%">
      <section>
        <h2>{{info.english}}</h2>
        <h3>{{info.chinese}}</h3>
        <p style="font-size:1.5rem">{{info.intro}}</p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: ['info', 'bannerUrl'],
  data() {
    return {
    }
  }
}
</script>

<style scoped>
.top-banner {
  position: relative;
  height: 35rem;
}
.top-banner>section {
  position: absolute;
  color: #ffffff;
  text-align: center;
  top: 7rem;
  width: 100%;
  font-size: 2rem;
}
.top-banner>section>h3 {
  margin: 0.7rem 30rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed;
}
</style>
