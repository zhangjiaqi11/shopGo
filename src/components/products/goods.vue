<template>
  <div class="goods">
     <el-button class="btn-mb" type="success" plain @click="pushADD">添加商品</el-button>
     <!-- 表格 -->
      <el-table
    ref="form"
    :data="goodList"
    highlight-current-row
    style="width: 100%">
    <el-table-column
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      property="goods_name"
      label="商品名称"
      >
    </el-table-column>
    <el-table-column
      property="goods_price"
      label="商品价格"
      >
    </el-table-column>
    <el-table-column
      property="goods_weight"
      label="商品重量">
    </el-table-column>
    <el-table-column
      property="upd_time"
      label="创建时间"
      >
     <template v-slot:default='{row}'>
       <p>{{row.upd_time|time}}</p>
     </template>
      </el-table-column>
      <el-table-column

      label="操作"
      >
      <el-button type="primary" plain icon='el-icon-edit' size="small"></el-button>
      <el-button type="danger" plain icon='el-icon-delete' size="small"></el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      pagesize: 5,
      pagenum: 1,
      goodList: [],
      total: 0
    }
  },
  methods: {
    async getProductList () {
      const { meta, data } = await this.$axios.get('goods', {
        params: {
          pagesize: this.pagesize,
          pagenum: this.pagenum
        }
      })
      if (meta.status === 200) {
        console.log(data.goods)
        this.total = data.total
        this.goodList = data.goods
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagenum = 1
      this.pagesize = val
      this.getProductList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getProductList()
    },
    pushADD () {
      this.$router.push('/goodsAdd')
    }
  },
  created () {
    this.getProductList()
  }
}
</script>

<style lang='scss' scoped>
  .goods{
    .btn-mb{
      margin-bottom: 10px;
    }
  }
</style>
