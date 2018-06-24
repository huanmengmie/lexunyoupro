<template>
<div>
  <el-row style="margin-top:4rem;">
      <el-col :offset="3" :span="18" >
          <el-input
              class="clearfix"
              placeholder="请输入关键词"
              prefix-icon="el-icon-search"
              @keyup.enter.native="getScenerys"
              v-model="listQuery.text">
          </el-input>
          <div class="clear scenery-tags">
              <el-checkbox-group v-model="hasChoosed" @change="chooseTag">
                <el-checkbox v-for="item in tagArray" :label="item.id" :key="item.id" border style="margin-bottom:1rem;">{{item.value}}</el-checkbox>
              </el-checkbox-group>
          </div>
          <div>
            <el-menu :default-active="'all'" class="el-menu-demo" mode="horizontal" @select="scenerySort">
              <el-menu-item index="all">综合</el-menu-item>
              <el-menu-item index="time">发布时间</el-menu-item>
              <el-menu-item index="score">网友评分</el-menu-item>
              <el-menu-item index="read">浏览量</el-menu-item>
              <el-menu-item index="like">喜欢量</el-menu-item>
              <el-cascader
                placeholder="请输入地址"
                :options="provinces"
                filterable
                clearable
                :props="props"
                @active-item-change = "handleProvinceChange"
                @change="filterByArea"
                style="top:.5rem"
              ></el-cascader>
            </el-menu>
          </div>
          </el-col>
  </el-row>
  <div style="padding-bottom:5rem;min-height:400px;" ref="showArea">
      <el-row>
        <el-col :span="6" v-for="(item,key) in scenerys" :key="item.id" :offset="key%3 == 0 ?3:0" style="padding:0 30px;">
          <show-scenery-card :info="item" :isScore="true" style="margin:1rem 0"></show-scenery-card>
        </el-col>
      </el-row>
      <p style="margin-top: 20px;">
        <span v-if="showNext" @click="nextPage" style="cursor: pointer;text-decoration: underline;">继续观看</span>
        <span v-else>没有更多了...</span>
      </p>
  </div>
</div>
</template>

<script>
import ShowSceneryCard from '@/components/frontend/showSceneryCard'
import filterList from '@/components/frontend/filterList'
import { fetchConstant } from '@/api/constant'
import { fetchList } from '@/api/scenery'
import { getCitys } from '@/api/city'

export default {
  components: {
    ShowSceneryCard,
    filterList
  },
  mounted() {
    this.getScenerys()
    this.getTags()
    this.setProvince()
  },
  computed: {
    showNext: function() {
      const num = this.listQuery.page * this.listQuery.limit
      if (num < this.listQuery.total) {
        return true
      } else {
        return false
      }
    }
  },
  data() {
    return {
      scenerys: [],
      tagArray: [],
      provinces: [],
      hasChoosed: [],
      listQuery: {
        page: 1,
        limit: 6,
        total: '',
        simple: false,
        deleted: false,
        privinceId: undefined,
        cityId: undefined,
        constantId: undefined,
        text: undefined,
        sort: '-si.scenery_score, -si.read_number,-si.publish_time'
      },
      props: { // 级联选择器属性
        value: 'basicCitysId',
        label: 'basicCitysName',
        children: 'citys'
      }
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
    setProvince() {
      getCitys(undefined, 1).then(res => {
        const data = res.data.list
        data.forEach(item => {
          item.citys = []
        })
        this.provinces = data
      })
    },
    scenerySort(key) {
      if (key === 'all') {
        this.resetQuery()
      } else if (key === 'time') {
        this.listQuery.sort = '-si.publish_time'
      } else if (key === 'score') {
        this.listQuery.sort = '-si.scenery_score'
      } else if (key === 'read') {
        this.listQuery.sort = '-si.read_number'
      } else if (key === 'like') {
        this.listQuery.sort = '-si.like_number'
      }
      this.getScenerys()
    },
    nextPage() {
      this.listQuery.page++
      const loading = this.$loading({
        target: this.$refs.showArea,
        text: '正在拼命加载中...'
      })
      fetchList(this.listQuery).then(res => {
        if (res.code === 20000) {
          const addList = res.data.list
          const temp = this.scenerys
          this.scenerys = temp.concat(addList)
        } else {
          this.$message({
            typs: 'info',
            message: '没有找到符合条件的内容，看看推荐吧！'
          })
        }
        loading.close()
      })
    },
    getScenerys() {
      const loading = this.$loading({
        target: this.$refs.showArea,
        text: '正在拼命加载中...'
      })
      fetchList(this.listQuery).then(res => {
        if (res.code === 20000) {
          this.scenerys = res.data.list
          this.listQuery.total = res.data.total
        } else {
          this.$message({
            typs: 'info',
            message: '没有找到符合条件的内容，看看推荐吧！'
          })
        }
        loading.close()
      })
    },
    chooseTag() {
      if (this.hasChoosed.length > 1) {
        this.hasChoosed.shift()
      }
      if (this.hasChoosed.length > 0) {
        this.listQuery.constantId = this.hasChoosed[0]
        this.getScenerys()
      }
    },
    handleProvinceChange(val) { // 省市二级联动获取数据
      const item = this.getCascaderObj(val[0], this.provinces)
      getCitys(val[0], undefined).then(res => {
        item.citys = res.data.list
      })
    },
    getCascaderObj(val, opt) { // 通过id找到数组中的元素
      for (var item of opt) {
        if (item.basicCitysId === val) {
          return item
        }
      }
    },
    filterByArea(val) {
      this.listQuery.privinceId = val[0]
      this.listQuery.cityId = val[1]
      this.getScenerys()
    },
    resetQuery() {
      this.listQuery = {
        page: 1,
        limit: 6,
        simple: false,
        deleted: false,
        privinceId: undefined,
        cityId: undefined,
        constantId: undefined,
        text: undefined,
        sort: '-si.scenery_score, -si.read_number,-si.publish_time'
      }
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
