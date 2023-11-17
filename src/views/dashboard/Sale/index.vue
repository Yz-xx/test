<template>
  <el-card class="box-card" style="margin: 10px 0px;">
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容 -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDate">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker v-model="date" value-format="yyyy-MM-dd" type="daterange" range-separator="-"
          start-placeholder="开始日期" end-placeholder="结束日期" size="mini" class="date">
        </el-date-picker>
      </div>
    </div>
    <div>
      <!-- 内容区 -->
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6" class="rightList">
          <div>
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li style="margin-bottom: 15px;margin-top: 20px;">
                <span class="rindex">1</span>
                <span style="margin: 0px 30px;">肯德基</span>
                <span class="rvalue">323,234</span>
              </li>
              <li style="margin-bottom: 15px;">
                <span class="rindex">2</span>
                <span style="margin: 0px 30px;">麦当劳</span>
                <span class="rvalue">299,132</span>
              </li>
              <li style="margin-bottom: 15px;">
                <span class="rindex">3</span>
                <span style="margin: 0px 30px;">肯德基</span>
                <span class="rvalue">283,998</span>
              </li>
              <li style="margin-bottom: 15px;">
                <span class="rbindex">4</span>
                <span style="margin: 0px 30px;">海底捞</span>
                <span class="rvalue">266,223</span>
              </li>
              <li style="margin-bottom: 15px;">
                <span class="rbindex">5</span>
                <span style="margin: 0px 30px;">西贝筱面村</span>
                <span class="rvalue">223,445</span>
              </li>
              <li style="margin-bottom: 15px;">
                <span class="rbindex">6</span>
                <span style="margin: 0px 30px;">汉堡王</span>
                <span class="rvalue">219,663</span>
              </li>
              <li style="margin-bottom: 15px;">
                <span class="rbindex">7</span>
                <span style="margin: 0px 30px;">真功夫</span>
                <span class="rvalue">200,997</span>
              </li>

            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',
      myCharts: null,
      //收集日历数据
      date: [],
    }
  },
  computed: {
    ...mapState({
      listState: state => state.home.list
    }),
    title() {
      return this.activeName == 'sale' ? '销售额' : '访问量'
    },
  },

  methods: {
    setDate() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },

    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },

    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },

    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  },

  mounted() {
    this.myCharts = echarts.init(this.$refs.charts)
    this.myCharts.setOption({
      title: {
        text: this.title + '趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: []
        }
      ]
    })
  },

  watch: {
    title() {
      this.myCharts.setOption({
        title: {
          text: this.title + '趋势'
        },
        xAxis: {
          data: this.title == '销售额' ? this.listState.orderFullYearAxis : this.listState.userFullYearAxis
        },
        series: {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: this.title == '销售额' ? this.listState.orderFullYear : this.listState.userFullYear,
          color: 'yellowgreen'
        }
      })
    },
    listState() {
      this.myCharts.setOption({
        title: {
          text: this.title + '趋势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.listState.orderFullYear,
            color: "yellowgreen",
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.tab {
  width: 100%;
}

.right {
  position: absolute;
  right: 0;
}

.right span {
  margin: 0px 10px;
}

.date {
  width: 230px;
  margin: 0px 20px;
}

.charts {
  width: 100%;
  height: 300px;
}

.rightList h3 {
  margin: 0 0;
  font-weight: normal;
  font-size: 14px;
}

ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}

ul li {
  height: 8%;
}

.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  color: white;
  text-align: center;
}

.rbindex {
  float: left;
  width: 20px;
  height: 20px;
  text-align: center;
}

.rvalue {
  float: right;
}
</style>