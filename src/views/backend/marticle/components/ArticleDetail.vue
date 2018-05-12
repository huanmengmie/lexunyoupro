<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">
          <div style="background: #d0d0d0;height:40px;">
          <div style="float:right;" class="clear">
            <router-link style="margin-right:15px;" v-show='isEdit' :to="{ path:'create-form'}">
              <el-button type="info">发布新文章</el-button>
            </router-link>
            <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">发布
            </el-button>
            <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button>
          </div>
          </div>
        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        </template>

      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>
              <span v-show="postForm.title.length>=26" class='title-prompt'>app可能会显示不全</span>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="6">
                  <el-form-item label-width="45px" label="作者:" class="postInfo-container-item">
                    <el-input placeholder="作者名" v-model="postForm.userName" disabled></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="100px" label="添加标签:" class="postInfo-container-item" required>
                    <el-select v-model="postForm.constantId" filterable placeholder="请选择">
                      <el-option v-for="item in tagArray" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="100px" label="相关景点:" class="postInfo-container-item" required>
                    <el-select v-model="postForm.constantId" filterable placeholder="请选择">
                      <el-option v-for="item in tagArray" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.display_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" >
          <MDinput name="content_short" v-model="postForm.content_short" required :maxlength="200">
            摘要
          </MDinput>
          <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
        </el-form-item>

        <el-form-item label="海报图">
          <div style="margin-bottom: 20px;">
            <Upload v-model="postForm.image_uri"></Upload>
          </div>
        </el-form-item>
        
        <div class="editor-container">
          <tinymce :height="400" ref="editor" v-model="postForm.content"></tinymce>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import Upload from '@/components/Upload/singleImage2'
import Tinymce from '@/components/Tinymce'
import { validateURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { fetchConstant } from '@/api/constant'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  authorId: '',
  constantId: '',
  userName: '',
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  source_name: '', // 文章外部作者
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false
}

export default {
  name: 'articleDetail',
  components: { MDinput, Tinymce, Sticky, Upload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(null)
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(null)
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm, {
        constantId: this.$store.state.user.id,
        userName: this.$store.state.user.name
      }),
      tagArray: [],
      fetchSuccess: true,
      loading: false,
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    }
  },
  created() {
    this.getTags()
    if (this.isEdit) {
      this.fetchData()
    } else {
      this.postForm = Object.assign({}, defaultForm, {
        authorId: this.$store.state.user.id,
        userName: this.$store.state.user.name
      })
    }
  },
  methods: {
    fetchData() {
      fetchArticle().then(response => {
        this.postForm = response.data
      }).catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
    },
    getTags() {
      const conditions = {
        simple: true,
        deleted: false,
        type: '1001'
      }
      fetchConstant(conditions).then(res => {
        this.tagArray = res.data.list
      })
    },
    submitForm() {
      this.postForm.display_time = parseInt(this.display_time / 1000)
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>

