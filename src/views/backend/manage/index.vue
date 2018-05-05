<template>
  <div class="components-container">
    <el-carousel height="35rem" style="margin-top:4rem;">
      <el-carousel-item v-for="(item,key) in banners" :key="key">
        <img :src="item" style="width:100%;height:100%;">
    </el-carousel-item>
    </el-carousel>
    <div class="editor-container">
      <dropzone v-on:dropzone-removedFile="remove"
      v-on:dropzone-success="dropzoneS"
      v-on:dropzone-fileAdded="add"
      id="myVueDropzone" url="https://httpbin.org/post"
      ></dropzone>
    </div>
  </div>
</template>

<script>
import Dropzone from '@/components/Dropzone'

export default {
  name: 'dropzone-demo',
  components: { Dropzone },
  data() {
    return {
      bannerMap: new Map(),
      banners: []
    }
  },
  methods: {
    dropzoneS(file) {
      console.log(file)
      this.$message({ message: 'Upload success', type: 'success' })
    },
    remove(file) {
      this.bannerMap.delete(file.name)
      this.banners = [...this.bannerMap.values()]
      this.$message({ message: 'Delete success', type: 'success' })
    },
    add(file) {
      this.bannerMap.set(file.name, window.URL.createObjectURL(file))
      console.log(window.URL.createObjectURL(file))
      this.banners = [...this.bannerMap.values()]
      console.log([...this.bannerMap.values()])
    }
  }
}
</script>


