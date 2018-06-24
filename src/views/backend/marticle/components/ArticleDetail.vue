<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :className="'sub-navbar published'">
        <template v-if="fetchSuccess">
          <div style="background: #d0d0d0;height:40px;">
          <div style="float:right;" class="clear">
            <router-link style="margin-right:15px;" v-if='isEdit' :to="{ path:'/marticle/add'}">
              <el-button type="info" icon="el-icon-edit">发布新文章</el-button>
            </router-link>
            <el-button type="info" icon="el-icon-edit" v-else @click="resetForm">发布新文章</el-button>
            <el-button v-loading="loading" style="margin-left: 10px;" v-if="isEdit" type="success" @click="updateForm(false)">更新
            </el-button>
            <el-button v-loading="loading" style="margin-left: 10px;" v-else type="success" @click="submitForm(false)">发布
            </el-button>
             <el-button v-loading="loading" style="margin-left: 10px;" v-if="isEdit" type="warning" @click="updateForm(true)">草稿
            </el-button>
            <el-button v-loading="loading" type="warning" v-else @click="submitForm(true)">草稿</el-button>
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
                  <el-form-item label-width="100px" label="添加标签:" class="postInfo-container-item" required prop="constantId">
                    <el-select v-model="postForm.constantId" filterable placeholder="请选择">
                      <el-option v-for="item in tagArray" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="100px" label="相关景点:" class="postInfo-container-item" prop="sceneryId">
                    <el-select v-model="postForm.sceneryId" filterable placeholder="请选择">
                      <el-option v-for="item in relatedScenery" :key="item.id" :label="item.sceneryName" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.publishTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="100px" label="省份:" class="postInfo-container-item" prop="provinceId" required>
                    <el-select v-model="postForm.provinceId" filterable clearable placeholder="请选择" @change="setCity">
                      <el-option v-for="item in provinceArray" :key="item.basicCitysId" :label="item.basicCitysName" :value="item.basicCitysId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                 <el-col :span="8">
                  <el-form-item label-width="100px" label="城市:" class="postInfo-container-item" prop="cityId" required>
                    <el-select v-model="postForm.cityId" filterable clearable placeholder="请选择">
                      <el-option v-for="item in cityArray" :key="item.basicCitysId" :label="item.basicCitysName" :value="item.basicCitysId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="100px" label="详细地址:" class="postInfo-container-item" prop="address" required>
                    <el-input placeholder="请输入具体地址" v-model="postForm.address"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

         <el-form-item style="margin-bottom: 40px;" >
            <MDinput name="intro" v-model="postForm.intro" required :maxlength="200">
              摘要
            </MDinput>
            <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
          </el-form-item>

        <el-form-item label="海报图">
          <div style="margin-bottom: 20px;">
            <Upload v-model="postForm.avatar"></Upload>
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
import { fetchArticle, createArticle, updateArticle } from '@/api/article'
import { fetchConstant } from '@/api/constant'
import { fetchList } from '@/api/scenery'
import { parseTime } from '@/utils'
import { getCitys } from '@/api/city'

const defaultForm = {
  id: undefined,
  title: '', // 文章题目
  avatar: '', // 文章图片
  intro: '', // 文章摘要
  content: '', // 文章内容
  sceneryId: '',
  constantId: '',
  provinceId: '',
  cityId: '',
  address: '',
  authorId: '',
  userName: '',
  publishTime: new Date() // 前台展示时间
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
      provinceArray: [],
      cityArray: [],
      relatedScenery: [],
      fetchSuccess: true,
      loading: false,
      rules: {
        avatar: [{ validator: [validateRequire, validateSourceUri], trigger: 'blur' }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        constantId: [{ required: true, message: '请选一个标签吧', trigger: 'change' }],
        sceneryId: [{ required: false, message: '关联景点更容易推广哦', trigger: 'blur' }]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.intro.length
    }
  },
  mounted() {
    this.getTags()
    this.getScenerys()
    this.setProvince()
    if (this.isEdit) {
      this.fetchData()
    } else {
      this.postForm = Object.assign({}, defaultForm, {
        authorId: this.$store.state.user.id,
        userName: this.$store.state.user.name
      })
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {
      fetchArticle(this.$route.params.id).then(response => {
        this.postForm = response.data
        this.postForm.userName = response.data.customer.userName
        this.setCity()
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
    getScenerys() {
      const conditions = {
        simple: true,
        deleted: false,
        sort: '-publish_time'
      }
      fetchList(conditions).then(res => {
        this.relatedScenery = res.data.list
      })
    },
    setProvince() {
      getCitys(undefined, 1).then(res => {
        this.provinceArray = res.data.list
      })
    },
    setCity() {
      getCitys(this.postForm.provinceId, undefined).then(res => {
        this.cityArray = res.data.list
      })
    },
    submitForm(isDraft) {
      this.postForm.publishTime = parseTime(this.postForm.publishTime)
      this.postForm.deleted = isDraft
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          createArticle(this.postForm).then(res => {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
          })
          this.isEdit = true
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateForm(isDraft) {
      this.postForm.publishTime = parseTime(this.postForm.publishTime)
      this.postForm.deleted = isDraft
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          updateArticle(this.postForm).then(res => {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
          })
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
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

