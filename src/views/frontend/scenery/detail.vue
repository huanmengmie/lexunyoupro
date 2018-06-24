<template>
    <el-row style="margin-top:4.2rem;">
      <el-col>
        <ul class="fixed-tools">
          <li>
            <span v-show="showLikeNumber" class="likeNumber">+{{ likeNumber }}</span>
            <svg-icon icon-class="like" @click.native="likeThis" @click.native.once="handleLikeThie"></svg-icon>
            <span>喜欢</span>
          </li>
          <li><svg-icon icon-class="argument" @click.native="handleFoucs('commentText')"></svg-icon><span>评论</span></li>
          <li><svg-icon icon-class="star" @click.native="handleFoucs('commentText')"></svg-icon><span>评分</span></li>
        </ul>
      </el-col>
      <el-col :offset="4" :span="13" class="content">
          <div class="baseinfo">
              <h1>{{ info.sceneryName }}</h1>
              <el-row>
                  <el-col :span="8" :offset="4">
                      <span>作者: {{ info.customer && info.customer.userName }}</span>
                  </el-col>
                  <el-col :span="8">
                      <span>文档标签: {{ info.constant && info.constant.value}}</span>
                  </el-col>
                  <el-col :span="5" :offset="3" class="clear">
                      <span style="float:left;">评分: </span>
                      <el-rate
                          v-model="info.sceneryScore"
                          disabled
                          show-score
                          disabled-void-color	="#FFF"
                          text-color="#ff9900"
                          style="float:left;">
                      </el-rate>
                  </el-col>
                  <el-col :span="6">
                      <span>发布时间: {{ info.publishTime }}</span>
                  </el-col>
                  <el-col :span="10">
                      位置:{{ info.province && info.province.basicCitysName }}-{{info.city && info.city.basicCitysName }}-{{ info.address }}
                  </el-col>
              </el-row>
          </div>
          <div>
              <p class="flag">摘要</p>
              <blockquote class="context intro">
                  {{info.sceneryIntro}}
              </blockquote>
          </div>
          <div>
              <p class="flag">主体</p>
              <section class="context" v-html="info.content"></section>
          </div>
          <div>
              <p class="flag">网友评论</p>
              <div v-if="comments.length > 0">
                  <div v-for="item in comments" :key="item.id" class="comment-area">
                      {{ item.customer && item.customer.userName }} 说: {{ item.content }}
                      <el-button type="text" class="button" @click="handleReply(item)">回复</el-button>
                      <chat-content :info="item.child" v-on:newComment = "handleAddComment" style="padding: 0 2rem;"></chat-content>
                  </div>
              </div>
              <p v-else>快来抢沙发吧！</p>
          </div>
          <div>
              <p class="flag">发表评论</p>
              <el-rate
                v-model="newComment.sceneryScore"
                show-text
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
              </el-rate>
              <el-input
              ref="commentText"
              class="comment-text"
              type="textarea"
              :rows="2"
              :placeholder="tips"
              @click.native="checkLogin"
              @keyup.esc.native="restComment"
              @blur="handleBlur"
              v-model="newComment.content">
              </el-input>
              <el-button type="primary" class="button" size="mini" @click="submitComment" style="float: right;margin: 1rem 2rem;">发表</el-button>
          </div>
      </el-col>
      <el-col :span="4">
        <recommend-list style="position:fixed;"></recommend-list>
      </el-col>
    </el-row>
</template>

<script>
import chatContent from './component/chatContent'
import recommendList from '@/components/frontend/recommendList'
import { fetchScenery, updateScenery } from '@/api/scenery'
import { fetchScommentsByAid, createScomment } from '@/api/scomment'

export default {
  components: {
    chatContent,
    recommendList
  },
  data() {
    return {
      info: {
        sceneryScore: 3.5
      },
      showLikeNumber: false,
      likeNumber: 0,
      tips: '说说你的看法',
      originalData: [], // 原始评论数据
      comments: [], // 处理后的评论数据
      newComment: {
        sceneryId: this.$route.params.id,
        customerId: this.$store.state.user.id,
        replyId: 0,
        content: '',
        sceneryScore: 3.5
      }
    }
  },
  watch: {
    originalData: function(val, oldVal) {
      this.handleComments(val)
    },
    '$route': function(val, oldVal) {
      this.fetchData()
      this.fetchComments()
      this.updateLikeNumber()
    }
  },
  mounted() {
    this.fetchData()
    this.fetchComments()
  },
  methods: {
    fetchData() {
      fetchScenery(this.$route.params.id).then(res => {
        this.info = res.data
      })
    },
    fetchComments() {
      fetchScommentsByAid(this.$route.params.id).then(res => {
        this.originalData = res.data
        this.handleComments(res.data)
      })
    },
    handleComments(data) {
      const map = new Map()
      data.forEach(item => {
        item.child = []
        map.set(item.id, item)
      })
      for (const item of map.values()) {
        if (item.replyId !== 0) {
          item.replyUserName = map.get(item.replyId).customer.userName
          map.get(item.replyId).child.push(item)
        }
      }
      const result = [...map.values()].filter(item => item.replyId === 0)
      this.comments = result
    },
    handleReply(item) {
      this.tips = '@' + item.customer.userName
      this.newComment.replyId = item.id
      this.$refs.commentText.focus()
    },
    checkLogin() {
      if (this.$store.state.user.id !== '') {
        return true
      } else {
        this.$notify({
          type: 'info',
          message: '请先登录',
          offset: 100
        })
        return false
      }
    },
    handleAddComment(item) {
      this.handleReply(item[0])
    },
    submitComment() {
      if (this.checkLogin()) {
        createScomment(this.newComment).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          const result = Object.assign({}, this.newComment, { id: res.newId }, { customer: { userName: this.$store.state.user.name }})
          this.originalData.push(result)
          this.restComment()
        })
      }
    },
    handleBlur() {
      if (!this.newComment.content.length > 0) {
        this.restComment()
      }
    },
    restComment() {
      this.newComment = {
        sceneryId: this.$route.params.id,
        customerId: this.$store.state.user.id,
        replyId: 0,
        content: '',
        sceneryScore: 3.5
      }
      this.tips = '说说你的看法'
    },
    handleFoucs(item) { // 获取焦点的方法
      console.log(item)
      this.$refs[item].focus()
    },
    likeThis() {
      if (this.likeNumber < 10) {
        this.likeNumber++
      }
      this.showLikeNumber = true
      setTimeout(() => {
        this.showLikeNumber = false
      }, 1000)
    },
    handleLikeThie() {
      setTimeout(() => {
        this.updateLikeNumber()
      }, 10000)
    },
    updateLikeNumber() {
      if (this.likeNumber > 0) {
        const scenery = {
          id: this.info.id,
          likeNumber: this.likeNumber
        }
        updateScenery(scenery).then(res => {
          this.likeNumber = 0
        })
      }
    }
  }
}
</script>

<style scoped>
.fixed-tools{
  list-style: none;
  position: fixed;
  top: 177px;
  left: 235px;
}
.fixed-tools .likeNumber{
  position: absolute;
  top: -15px;
  left: 27px;
}
.fixed-tools li{
  background-color: #f2f2f2;
  margin: 5px 3px;
  padding: 7px 13px;
  cursor: pointer;
}
.fixed-tools .svg-icon{
  width: 40px;
  height: 40px;
}

.fixed-tools span{
  display: block;
}

.content{
  background-color: #F2F2F2;
  padding: .5rem 0;
}

.baseinfo{
    border-bottom: 1px dashed;
    padding: 1rem;
    margin: 0 2rem;
}
.baseinfo > h1{
    font-size: 18px;
    font-weight: 700;
}

.flag{
    font-size: 18px;
    text-align: left;
    margin: 10px 2rem;
    color: #6ab6ef;
}

.intro{
    font-size: 14px;
    text-indent: 28px;
}

.context {
  text-align: left;
  padding: .5rem 2rem;
}

.comment-area{
    text-align: left;
    padding: 0 4rem;
}

.comment-text{
    min-height: 33px;
    width: 94%;
    margin: 0 2rem;
}
</style>
