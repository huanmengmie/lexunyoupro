<template>
  <div class="components-container">
    <el-row v-show="banners.length > 0">
      <el-col :span="12" :offset="6">
        <p class="prompt-info"><span style="color:#1f2d3d;">效果预览</span><el-button type="primary" size="sm" @click="uploadFiles">开始上传</el-button></p>
        <el-carousel height="26rem">
          <el-carousel-item v-for="(item,key) in banners" :key="key">
            <img :src="item" style="width:100%;height:100%;">
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
   
    <div class="editor-container">
      <dropzone v-on:dropzone-removedFile="remove"
      v-on:dropzone-success="dropzoneS"
      v-on:dropzone-fileAdded="add"
      id="myVueDropzone"
      :url="uploadUrl"
      ref="myVueDropzone"
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
      banners: [],
      uploadUrl: this.$store.state.constant.qiniu
    }
  },
  methods: {
    dropzoneS(file) {
      this.$message({ message: 'Upload success', type: 'success' })
    },
    remove(file) {
      this.bannerMap.delete(file.name)
      this.banners = [...this.bannerMap.values()]
      this.$message({ message: 'Delete success', type: 'success' })
    },
    add(file) {
      this.bannerMap.set(file.name, window.URL.createObjectURL(file))
      this.banners = [...this.bannerMap.values()]
    },
    uploadFiles() {
      this.$refs.myVueDropzone.processQueue()
    }
  }
}
</script>

<style scoped>
.el-button{
  margin-left: 80%; 
}
</style>
