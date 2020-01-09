<template>
  <div class="categories">
      <el-button type="success" plain @click="addPro">添加分类</el-button>
      <!-- 表格 -->
  <el-table
    v-loading='load'
    element-loading-text='拼命加载中'
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :data="productList"
    style="width: 100%"
    row-key="cat_id"
  >
    <el-table-column
      label="分类名称"
      prop="cat_name"
      >

    </el-table-column>
    <el-table-column
      label="是否有效"
      >
      <template v-slot:default='{row}'>
        <p>{{row.cat_deleted ? '否':'是'}}</p>
      </template>
    </el-table-column>
    <el-table-column
      label="排序"
      prop="cat_level"
      >
    </el-table-column>
     <el-table-column
      label="操作"
     >
    <template v-slot:default='{row}'>
       <el-button type="primary" plain size='small' icon="el-icon-edit" @click="showEditCate(row.cat_id,row.cat_name)"></el-button>
     <el-button type="danger" plain size='small' icon="el-icon-delete" @click="delCate(row.cat_id)"></el-button>
    </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加对话框 -->
    <el-dialog
  title="添加分类"
  :visible.sync="dialogVisible"
  width="40%">
  <el-form ref="form" :model="form" label-width="80px" :rules='rules'>
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="form.cat_name" placeholder="请输入分类名称"></el-input>
  </el-form-item>
  <el-form-item label="父级名称">
   <div class="block">
  <span class="demonstration"></span>
  <el-cascader
    clearable
    v-model="form.cat_pid"
    :options="options"
    :props="props"
    ></el-cascader>
</div>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addProduct"> 添 加</el-button>
  </span>
</el-dialog>
<!-- 修改对话框 -->
<el-dialog
  title="修改分类"
  :visible.sync="editdialogVisible"
  width="40%">
  <el-form ref="editform" :model="editform" label-width="80px" :rules='rules'>
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editform.cat_name" placeholder="请输入分类名称"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editProduct"> 修改</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      productList: [],
      pagenum: 1,
      pagesize: 5,
      load: false,
      total: 0,
      value: [],
      options: [],
      dialogVisible: false,
      editdialogVisible: false,
      form: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      editform: {
        cat_name: '',
        id: ''
      },
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      rules: {
        cat_name: [
          { required: true, message: '分类不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getProductList(3)
  },
  methods: {
    async getProductList (type) {
      this.load = true
      const { meta, data } = await this.$axios.get(`categories`, {
        params: {
          type: type,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.productList = data.result
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
      this.load = false
    },
    handleSizeChange (val) {
      this.pagenum = 1
      this.pagesize = val
      this.getProductList(3)
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getProductList(3)
    },
    async addPro () {
      try {
        this.form.cat_pid = []
        this.dialogVisible = true
        const { meta, data } = await this.$axios.get(`categories`, {
          params: {
            type: 2
          }
        })
        if (meta.status === 200) {
          this.options = data
          console.log(this.options)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async addProduct () {
      await this.$refs.form.validate()
      const catpid = this.form.cat_pid
      const { meta } = await this.$axios.post('categories', {
        cat_name: this.form.cat_name,
        cat_pid: catpid[catpid.length - 1] || 0,
        cat_level: catpid.length
      })
      if (meta.status === 201) {
        this.$message.success('添加成功 ')
        this.dialogVisible = false
        this.getProductList()
      } else {
        this.$message.error(meta.msg)
      }
      this.$refs.form.resetFields()
    },
    async delCate (id) {
      const { meta } = await this.$axios.delete(`categories/${id}`)
      if (meta.status === 200) {
        this.$message.success('删除成功')
        this.getProductList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    showEditCate (id, name) {
      this.editform.cat_name = name
      this.editdialogVisible = true
      this.editform.id = id
    },
    async editProduct () {
      const { meta } = await this.$axios.put(`categories/${this.editform.id}`, {
        cat_name: this.editform.cat_name
      })
      if (meta.status === 200) {
        this.$message.success('修改成功')
        this.editdialogVisible = false
        this.getProductList()
      } else {
        this.$message.error(meta.msg)
      }
    }

  }

}
</script>

<style lang='scss' scoped>
  .categories{
    .el-button{
      margin-bottom: 10px;
    }

  }
</style>
