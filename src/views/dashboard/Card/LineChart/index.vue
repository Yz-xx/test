<template>
  <div class="charts" ref="charts">

  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'LineChart',

  mounted() {
    let lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: 'category',
      },
      yAxis: { show: false },
      series: [
        {
          type: 'line',
          data: [30, 10, 38, 10, 20, 15, 29, 14, 20],
          smooth: true,
          //拐点样式的设置
          itemStyle: {
            opacity: 0
          },
          //线条的样式
          lineStyle: {
            color: 'cyan',
          },
          //填充颜色的设置
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'cyan'
                },
                {
                  offset: 1,
                  color: '#fff'
                }
              ],
              global: false
            }
          }
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })
  },
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>