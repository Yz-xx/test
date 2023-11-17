<template>
  <div>
    <el-card style="margin-bottom: 20px;">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示spu列表的结构 -->
      <div v-show="scene == 0">
        <el-button type="primary" icon="el-icon-olus" :disabled="!category3Id" @click="addSpu">添加Spu</el-button>
        <el-table style="width: 100%;" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width=""></el-table-column>
          <el-table-column prop="description" label="spu描述" width=""></el-table-column>
          <el-table-column prop="prop" label="操作" width="">
            <template slot-scope="{row,$index}">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku"
                @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu"
                @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="产看当前spu的sku列表"
                @click="handler(row)"></hint-button>
              <el-popconfirm :title="`确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 20px;text-align: center;" :current-page="page" :total="total" :page-size="limit"
          :page-count="7" :page-sizes="[3, 5, 10]" layout="prev,pager,next,jumper,->,sizes,total"
          @current-change="getSpuList" @size-change="handleSizeChange">
        </el-pagination>
      </div>
      <div>
        <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"></SpuForm>
        <SkuForm v-show="scene == 2" @changeScenes="changeScenes" ref="sku"></SkuForm>
      </div>
    </el-card>
    <el-dialog :title="`${spu.spuName}的SKU列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" style="width: 100%;" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
        <el-table-column prop="price" label="价格" width="width"></el-table-column>
        <el-table-column prop="weight" label="重量" width="width"></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
import { done } from 'nprogress'
export default {
  name: 'Spu',
  components: { SkuForm, SpuForm },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      //spu列表的数据
      records: [],
      total: 0,
      //0代表展示spu列表数据，1代表添加|修改spu，2代表添加sku
      scene: 0,
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true
    }
  },
  methods: {
    async getSpuList(pages = 1) {
      this.page = pages
      let result = await this.$API.spu.reqSpuList(this.page, this.limit, this.category3Id)
      if (result.code == 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },

    getCategoryId(data) {
      this.category1Id = data.category1Id
      this.category2Id = data.category2Id
      this.category3Id = data.category3Id
      if (this.category3Id) {
        this.getSpuList()
      }
    },

    handleSizeChange(size) {
      this.limit = size
      this.getSpuList()
    },

    //添加Spu按钮的回调
    addSpu() {
      this.scene = 1
      this.$refs.spu.addSpuData(this.category3Id)
    },

    //修改Spu的回调
    updateSpu(row) {
      this.scene = 1
      //获取子组件spu的方法
      this.$refs.spu.initSpuData(row)
    },

    //删除Spu按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code == 200) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },

    changeScene({ scene, flag }) {
      this.scene = scene
      if (flag == '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }

    },

    //添加Sku的回调
    addSku(row) {
      this.scene = 2
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },

    //查看sku列表按钮的回调
    async handler(row) {
      this.dialogTableVisible = true
      this.spu = row
      let result = await this.$API.spu.reqSkuList(row.id)
      if (result.code == 200) {
        this.skuList = result.data
        this.loading = false
      }
    },

    //关闭对话框的回调
    close(done) {
      this.loading = true
      this.skuList = []
      done()
    },

    changeScenes(scene) {
      this.scene = scene
    }
  }
}
</script>

<style lang="scss" scoped></style>