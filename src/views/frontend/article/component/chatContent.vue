<template>
    <div class="replys">
        <div v-if="info.length > 0" v-for="elem in info" :key="elem.id">
            {{ elem.customer.userName }} 回复 {{ elem.replyUserName }} 说: {{elem.content}}
            <el-button type="text" class="button" @click="comment(info)">回复</el-button>
            <chat-content :info='elem.child' @newComment="comment"></chat-content>
        </div>
    </div>
</template>

<script>
export default {
  name: 'chatContent',
  props: ['info'],
  methods: {
    comment(item) {
      this.$emit('newComment', item)
    }
  }
}
</script>

<style scoped>

</style>
