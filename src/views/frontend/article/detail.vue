<template>
    <el-row style="margin-top:4.2rem;">
        <el-col :offset="3" :span="14">
            <div class="baseinfo">
                <h1>{{ info.title }}</h1>
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
                            v-model="info.score"
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
                        推荐景点: 
                        <router-link :to="{ name:'sceneryDetail',params:{id:info.sceneryInfo && info.sceneryInfo.id} }">
                            <span style="color: #409EFF;">{{ info.sceneryInfo && info.sceneryInfo.sceneryName }}</span>
                        </router-link>
                    </el-col>
                </el-row>
            </div>
            <div>
                <p class="flag">摘要</p>
                <blockquote class="context intro">
                    {{info.intro}}
                </blockquote>
            </div>
            <div>
                <p class="flag">主体</p>
                <section class="context" v-html="info.content"></section>
            </div>
            <div v-show="test">
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
                  v-model="newComment.articleScore"
                  show-text
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                </el-rate>
                <el-input
                ref="commentText"
                class="comment-text"
                type="textarea"
                :rows="2"
                :placeholder="tips"
                @keyup.esc.native="restComment"
                @blur="handleBlur"
                v-model="newComment.content">
                </el-input>
                <el-button type="primary" class="button" size="mini" @click="submitComment" style="float: right;margin: 1rem 2rem;">发表</el-button>
            </div>
        </el-col>
        <el-col :span="4">
          <recommend-list></recommend-list>
        </el-col>
    </el-row>
</template>

<script>
import chatContent from './component/chatContent'
import recommendList from '@/components/frontend/recommendList'
import { fetchArticle } from '@/api/article'
import { fetchAcommentsByAid, createAcomment } from '@/api/acomment'

export default {
  components: {
    chatContent,
    recommendList
  },
  data() {
    return {
      info: '',
      test: true,
      tips: '说说你的看法',
      originalData: [], // 原始评论数据
      comments: [], // 处理后的评论数据
      newComment: {
        articleId: this.$route.params.id,
        customerId: this.$store.state.user.id,
        replyId: 0,
        content: '',
        articleScore: 5
      }
    }
  },
  watch: {
    originalData: function(val, oldVal) {
      this.handleComments(val)
    },
    '$route': function() {
      this.fetchData()
      this.fetchComments()
    }
  },
  mounted() {
    this.fetchData()
    this.fetchComments()
  },
  methods: {
    fetchData() {
      fetchArticle(this.$route.params.id).then(res => {
        this.info = res.data
      })
    },
    fetchComments() {
      fetchAcommentsByAid(this.$route.params.id).then(res => {
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
    handleAddComment(item) {
      this.handleReply(item[0])
    },
    submitComment() {
      createAcomment(this.newComment).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        const result = Object.assign({}, this.newComment, { id: res.newId }, { customer: { userName: this.$store.state.user.name }})
        this.originalData.push(result)
        this.restComment()
      })
    },
    handleBlur() {
      if (!this.newComment.content.length > 0) {
        this.restComment()
      }
    },
    restComment() {
      this.newComment = {
        articleId: this.$route.params.id,
        customerId: this.$store.state.user.id,
        replyId: 0,
        content: '',
        articleScore: 5
      }
      this.tips = '说说你的看法'
    }
  }
}
</script>

<style scoped>
.el-col{
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
