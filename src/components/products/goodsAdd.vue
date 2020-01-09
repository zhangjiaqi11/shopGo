<template>
  <div class="goodsAdd">
     <!-- 步骤条 -->
     <el-steps :active="active" finish-status="success">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>
    <!-- tab栏 -->
    <el-tabs  v-model="activeName" :tab-position="tabPosition"  @tab-click="handleClick">
      <el-tab-pane  label="基本信息"  name="1">
         <el-form  :rules='rules' ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="form.goods_number  " placeholder="请输入商品数量"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <div class="block">
              <span class="demonstration"></span>
              <el-cascader
              clearable
              :props="props"
                v-model="form.goods_cat"
                :options="options"
                ></el-cascader>
            </div>
          </el-form-item>
          <el-button type="primary" @click="next1">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane  label="商品图片"  name="2">
        <el-upload
          multiple
          name='file'
          :headers='headers'
          action="http://localhost:8888/api/private/v1/upload"
          :on-success='respons'
          :on-preview="handlePictureCardPreview"
          list-type="picture-card"
         >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button type='primary' @click="next1">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane  label="商品内容"  name="3">
        <quill-editor v-model="form.goods_introduce"></quill-editor>
  <el-button type="primary" @click="addPro">添加</el-button>
      </el-tab-pane>
    </el-tabs>
    <!-- 表单 -->

  </div>
</template>

<script>
export default {
  data () {
    return {
      fileList: '',
      active: 0,
      tabPosition: 'left',
      activeName: '1',
      options: [],
      cat_pid: [],
      headers: {
        Authorization: localStorage.getItem('token')
      },
      dialogVisible: false,
      dialogImageUrl: '',
      form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []

      },
      props: {
        value: 'cat_id',
        children: 'children',
        label: 'cat_name'
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: ['blur', 'change'] }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: ['blur', 'change'] }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: ['blur', 'change'] }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getProducList()
  },
  methods: {
    handleClick (tab, event) {
      this.active = +this.activeName - 1
    },
    async getProducList () {
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          type: 3
        }
      })
      if (meta.status === 200) {
        this.options = data
        console.log(data)
      } else {
        this.$message.error(meta.msg)
      }
    },
    next1 () {
      this.active++
      this.activeName = (this.active + 1).toString()
    },
    respons (response, file, fileList) {
      const { meta, data } = response
      if (meta.status === 200) {
        this.form.pics.push({
          pic: data.tmp_path
        })
        this.fileList = fileList
      } else {
        this.$message.error(meta.msg)
      }
    },
    handlePictureCardPreview (file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    async addPro () {
      console.log(this.form.goods_cat)
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      if (meta.status === 201) {
        this.$message.success('添加成功')
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss' >
  .goodsAdd{
    .ql-editor{
      height: 300px;
    }
  }
</style>
