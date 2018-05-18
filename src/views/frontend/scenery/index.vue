<template>
<div>
  <el-row style="margin-top:4rem;">
      <el-col :offset="3" :span="18" >
          <el-input
              class="clearfix"
              placeholder="请输入景点名称"
              prefix-icon="el-icon-search"
              v-model="searchConditions">
          </el-input>
          <div class="clear scenery-tags">
              <!-- <div v-for="(item,key) in conditions" :key="key">
                  <filter-list :info="item.info" :detail="item.value" @chooseCondition="handleCondition"></filter-list>
              </div> -->
              <el-checkbox-group v-model="hasChoosed" @change="test">
                <el-checkbox v-for="item in tagArray" :label="item.id" :key="item.id" border style="margin-bottom:1rem;">{{item.value}}</el-checkbox>
              </el-checkbox-group>
          </div>
          <div>
            <el-menu :default-active="'all'" class="el-menu-demo" mode="horizontal" @select="scenerySort">
              <el-menu-item index="all">综合</el-menu-item>
              <el-menu-item index="time">发布时间</el-menu-item>
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
          <show-scenery-card :info="item" :isScore="true" style="margin:1rem 0"></show-scenery-card>
        </el-col>
      </el-row>
  </div>
</div>
</template>

<script>
import ShowSceneryCard from '@/components/frontend/showSceneryCard'
import filterList from '@/components/frontend/filterList'
import { fetchConstant } from '@/api/constant'
import { fetchList } from '@/api/scenery'

export default {
  components: {
    ShowSceneryCard,
    filterList
  },
  mounted() {
    this.getScenerys()
    this.getTags()
  },
  data() {
    return {
      searchConditions: '',
      scenerys: [],
      tagArray: [],
      hasChoosed: [],
      listQuery: {
        page: 1,
        limit: 10,
        simple: false,
        constantId: undefined,
        sort: '-si.scenery_score,-si.publish_time'
      },
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
    getTags() {
      const conditions = {
        simple: true,
        deleted: false,
        type: '1002'
      }
      fetchConstant(conditions).then(res => {
        this.tagArray = res.data.list
      })
    },
    scenerySort(key) {
      if (key === 'all') {
        this.listQuery.sort = '-si.scenery_score,-si.publish_time'
      } else if (key === 'time') {
        this.listQuery.sort = '-si.publish_time'
      } else if (key === 'score') {
        this.listQuery.sort = '-si.scenery_score'
      }
      this.getScenerys()
    },
    getScenerys() {
      fetchList(this.listQuery).then(res => {
        this.scenerys = res.data.list
      })
    },
    test() {
      if (this.hasChoosed.length > 1) {
        this.hasChoosed.shift()
      }
      this.listQuery.constantId = this.hasChoosed[0]
      this.getScenerys()
      console.log(1)
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 40%;
  margin: 1rem 5rem 1rem 50%;
}
.scenery-tags {
  border: 1px solid #e8e8e8;
  padding: 1rem 2rem 0rem;
  text-align: left;
}
</style>
