<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-olus" style="margin:10px 0px" @click="showDialog">添加</el-button>
    <!-- 表格组件
    data:表格组件系那个来展示的数据--数组类型 -->
    <el-table style="width:100%" border :data="list">
      <el-table-column prop="prop" label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" style="height: 80px;width: 80px;">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination style="margin-top: 20px;text-align: center;" :current-page="page" :total="total" :page-size="limit"
      :page-count="7" :page-sizes="[3, 5, 10]" layout="prev,pager,next,jumper,->,sizes,total"
      @current-change="getPageList" @size-change="handleSizeChange">

    </el-pagination>
    <!-- 对话框 
    visible.sync：控制对话框显示与隐藏
    -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form style="width: 80%;" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      dialogFormVisible: false,
      tmForm: {
        taName: '',
        logoUrl: ''
      },
      //表单验证规则
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
        ],
        logoUrl: [
          { required: true, message: '请选择品牌图片', trigger: 'change' }
        ],
      }
    }
  },

  methods: {
    async getPageList(pager = 1) {
      this.page = pager
      let result = await this.$API.trademark.reqTradeMarkList(this.page, this.limit)
      if (result.code == 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },

    handleSizeChange(size) {
      this.limit = size
      this.getPageList()
    },

    //点击添加品牌按钮
    showDialog() {
      this.dialogFormVisible = true
      this.tmForm = { tmName: '', logoUrl: '' }
    },

    updateTradeMark(row) {
      this.dialogFormVisible = true
      this.tmForm = { ...row }
    },

    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isPNG = file.type === 'image/png';

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return (isPNG || isJPG) && isLt2M;
    },

    //确定按钮（添加或修改品牌）
    async addOrUpdateTradeMark() {
      if (this.tmForm.tmName.length < 2 || this.tmForm.tmName.length > 10) {
        this.$message({
          message: '请输入正确的品牌名称',
          type: 'warning'
        })
        return
      }
      if (this.tmForm.logoUrl == '') {
        this.$message({
          message: '图片未上传',
          type: 'warning'
        })
        return
      }
      this.dialogFormVisible = false
      let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
      console.log(result)
      if (result.code == 200) {
        this.$message({
          message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功',
          type: 'success'
        })
        this.getPageList(this.tmForm.id ? this.page : 1)
      }

    },

    deleteTradeMark(row) {
      //弹框
      this.$confirm(`你确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        //当用户点击确定按钮的时候会出发
        //向服务器发请求
        let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
        //如果删除成功
        if (result.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          //再次获取品牌列表数据
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
        }
      }).catch(() => {
        //当用户点击取消按钮的时候会触发
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
    }


  },

  mounted() {
    this.getPageList()
  },
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>