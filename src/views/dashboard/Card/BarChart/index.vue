<template>
  <div class="charts" ref="charts">

  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'BarChart',

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
          type: 'bar',
          data: [30, 10, 38, 10, 20, 15, 29, 14, 20],
          color: 'pink'
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