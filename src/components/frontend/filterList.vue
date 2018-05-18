<template>
  <el-row>
    <el-col :span="2">
      <span>{{ info }}:</span>
    </el-col>
    <el-col :span="22" style="text-align:left">
      <el-radio v-model="condition" v-for="item in detail" :label="item.id" :key="item.id" border  @change="addCondition(item)">{{item.value}}</el-radio>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['info', 'detail'],
  data() {
    return {
      condition: 0
    }
  },
  methods: {
    addCondition(item) {
      this.$emit('chooseCondition', item)
    }
  }
}
</script>

<style scoped>
.el-row{
    padding: 1rem 0 .5rem;
    border-bottom: 1px dashed #e8e8e8;
}

</style>
