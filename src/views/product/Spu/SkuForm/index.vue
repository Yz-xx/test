<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" label-width="80px" :inline="true">
          <el-form-item :label="attr.attrName" v-for="(attr, index) in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList" :key="attrValue.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" label-width="80px" :inline="true">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr, index) in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border style="width: 100%;" :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column width="80" type="selection" prop="prop">
          </el-table-column>
          <el-table-column label="图片" width="width" prop="prop">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width: 100px; height: 100px;">
            </template>
          </el-table-column>
          <el-table-column label="名称" width="width" prop="imgName">
          </el-table-column>
          <el-table-column label="操作" width="width" prop="prop">
            <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row)">设为默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'SkuForm',
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        skuName: '',
        weight: '',
        price: 0,
        skuDefaultImg: '',
        skuDesc: '',
        skuImageList: [
          // {
          //   id:0,
          //   imgName:'',
          //   imgUrl:'',
          //   isDefault:'',
          //   skuId:0,
          //   spuImgId:0
          // }
        ],
        skuAttrValueList: [
          {
            attrId: 0,
            valueId: 0,
          }
        ],
        skuSaleAttrValueList: [
          // {
          //   id:0,
          //   saleAttrId:0,
          //   saleAttrName:'',
          //   saleAttrValueId:0,
          //   saleAttrValueName:'',
          //   skuId:0,
          //   spuId:0
          // }
        ],
      },
      spu: {},
      imageList: []
    }
  },

  methods: {
    //获取skuForm数据
    async getData(category1Id, category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      //获取图片的数据
      let imgResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (imgResult.code == 200) {
        let list = imgResult.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      //获取销售属性的数据
      let attrResult = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (attrResult.code == 200) {
        this.spuSaleAttrList = attrResult.data
      }
      //获取平台属性的数据
      let attrInfo = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (attrInfo.code == 200) {
        this.attrInfoList = attrInfo.data
      }
    },

    //table表格复选框事件
    handleSelectionChange(selection) {
      this.imageList = selection
    },

    //排他操作 
    changeDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },

    //取消按钮的回调
    cancel() {
      Object.assign(this._data, this.$options.data())
      this.$emit('changeScenes', 0)
    },

    //保存按钮的回调
    async save() {
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      // let arr = []
      // attrInfoList.forEach(item => {
      //   if (item.attrIdAndValueId) {
      //     const [attrId, valueId] = item.attrIdAndValueId.split(':')
      //     let obj = { valueId, attrId }
      //     arr.push(obj)
      //   }
      // })
      // skuInfo.skuAttrValueList = arr

      //整理平台属性的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])

      //整理销售属性的数据
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])

      //整理图片数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })

      //发请求
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code == 200) {
        this.$message({
          message: '添加SKU成功',
          type: 'success'
        })
        this.$emit('changeScenes', 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>