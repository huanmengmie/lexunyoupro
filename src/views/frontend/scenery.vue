<template>
<div>
  <my-header></my-header>
  <el-row style="margin-top:4rem;">
      <el-col :offset="3" :span="18" >
          <el-input
              class="clearfix"
              placeholder="请输入景点名称"
              prefix-icon="el-icon-search"
              v-model="searchConditions">
          </el-input>
          <div class="filters">
              <div v-for="(item,key) in conditions" :key="key">
                  <filter-list :info="item.info" :detail="item.value" @chooseCondition="handleCondition"></filter-list>
              </div>
          </div>
          <div>
            <el-menu :default-active="'all'" class="el-menu-demo" mode="horizontal" @select="scenerySort">
              <el-menu-item index="all">综合</el-menu-item>
              <el-menu-item index="hot">人气排序</el-menu-item>
              <el-menu-item index="score">网友评分</el-menu-item>
              <el-cascader
                placeholder="请输入地址"
                :options="scenerySearch"
                filterable
                change-on-select
                style="top:.5rem"
              ></el-cascader>
            </el-menu>
          </div>
          </el-col>
  </el-row>
  <div style="padding-bottom:5rem;">
      <el-row>
        <el-col :span="6" v-for="(item,key) in scenerys" :key="item.id" :offset="key%3 == 0 ?3:0" style="padding:0 30px;">
          <show-card :info="item" :isScore="false" style="margin:1rem 0"></show-card>
        </el-col>
      </el-row>
  </div>
  <my-footer></my-footer>
</div>
</template>

<script>
import myHeader from '@/components/common/myHeader'
import myFooter from '@/components/common/myFooter'
import showCard from '@/components/frontend/showCard'
import filterList from '@/components/frontend/filterList'
export default {
  components: {
    showCard,
    filterList,
    myHeader,
    myFooter
  },
  mounted() {
    this.getScenerys()
  },
  data() {
    return {
      searchConditions: '',
      scenerys: [],
      hasChoosed: new Map(),
      scenerySearch: [],
      conditions: [
        {
          info: '推荐月份',
          type: 'month',
          value: [
            {
              id: 1,
              type: 'month',
              value: '1月'
            },
            {
              id: 2,
              type: 'month',
              value: '2月'
            },
            {
              id: 3,
              type: 'month',
              value: '3月'
            }
          ]
        },
        {
          info: '旅游标签',
          type: 'labels',
          value: [
            {
              id: 4,
              type: 'tags',
              value: '亲子游'
            },
            {
              id: 5,
              type: 'tags',
              value: '度蜜月'
            },
            {
              id: 6,
              type: 'tags',
              value: '高山流水'
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleCondition(item) {
      this.hasChoosed.set(item.type, item.id)
      console.log(this.hasChoosed, item)
    },
    scenerySort(key, keyPath) {
      console.log('key:' + key + 'keyPath:' + keyPath)
    },
    getScenerys() {
      this.$http.get('/api/scenerys')
        .then((res) => {
          this.scenerys = res.data
          console.log(res, res.data)
        })
    }
  }
}
</script>

<style scoped>
.el-input {
    width: 40%;
    margin: 1rem 5rem 1rem 50%;
}
.filters {
  margin-bottom: 5px;
  border: 1px solid #e8e8e8;
  border-bottom: none;
}
</style>
