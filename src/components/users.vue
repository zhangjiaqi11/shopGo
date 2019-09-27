<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <hr />
    <!-- 输入框 -->
    <el-input placeholder="请输入搜索关键字" v-model="query" class="input-with-select" >
      <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
    </el-input>
    <el-button type="success" plain @click="addShow">添加用户</el-button>

    <!-- 表格 -->
    <el-table :data="usersList" border style="width: 100%">
      <el-table-column width="180" prop="username" label="姓名"></el-table-column>
      <el-table-column width="180" prop="email" label="邮箱"></el-table-column>
      <el-table-column width="180" prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="obj">
          <el-switch
            v-model="obj.row.mg_state"
            @change="changeState(obj.row.mg_state,obj.row.id)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="obj">
          <el-button type="primary" @click="editShow(obj.row)" plain icon="el-icon-edit"></el-button>
          <el-button type="danger" @click="delUser(obj.row.id)" plain icon="el-icon-delete"></el-button>
          <el-button type="success" plain icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.pagenum"
        :page-sizes="[2, 4, 6, 8,10]"
        :page-size="this.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 添加对话框 -->
    <el-dialog @close="emptyDio" title="添加用户" :visible.sync="dialogVisible" width="40%">
      <el-form :rules="rules" ref="form" :model="form"  label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
         <el-form-item   label="密码" prop="password">
          <el-input placeholder="请输入密码" type='password' v-model="form.password"></el-input>
        </el-form-item>
         <el-form-item  label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
         <el-form-item  label="手机" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click='cancelShow'>取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 修改对话框 -->
    <el-dialog   title="添加用户" :visible.sync="editVisible" width="40%">
      <el-form :rules="rules" ref="editForm" :model="editForm"  label-width="80px">
        <el-form-item label="用户名" >
         <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>

         <el-form-item  label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
         <el-form-item  label="手机" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hiddialog">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      usersList: [],
      total: 0,
      query: '',
      pagenum: 1,
      pagesize: 2,
      dialogVisible: false,
      editVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        id: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { message: '请输入手机号', trigger: 'blur' },
          { pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    async getuserlist () {
      const res = await this.$axios
        .get('http://localhost:8888/api/private/v1/users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })

      const { data, meta } = res
      this.total = data.total
      if (meta.status === 200) {
        this.usersList = data.users
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getuserlist()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getuserlist()
    },
    async delUser (id) {
      try {
        await this.$confirm('确定删除吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if ((this.usersList.length === 1) & (this.pagenum > 1)) {
            this.pagenum--
          }
          this.getuserlist()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (error) {
        console.log(error)
      }
    },
    searchList () {
      this.getuserlist()
    },
    async changeState (type, uId) {
      const res = await this.$axios.put(`users/${uId}/state/${type}`)
      if (res.meta.status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.danger(res.meta.msg)
      }
      this.getuserlist()
    },
    async addUser () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          this.$message.success('创建成功')
          this.pagenum = Math.ceil(++this.total / this.pagesize)
          this.getuserlist()
          this.dialogVisible = false
        } else {
          this.$message.warning(meta.msg)
        }
      } catch (e) {
        this.dialogVisible = false
      }
    },
    addShow () {
      this.dialogVisible = true
    },
    cancelShow () {
      this.dialogVisible = false
    },
    emptyDio () {
      this.$refs.form.resetFields()
    },
    hiddialog () {
      this.editVisible = false
    },
    editShow (row) {
      this.editForm.username = row.username
      this.editForm.id = row.id
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editVisible = true
    },
    async editUser () {
      try {
        const { meta } = await this.$axios.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (meta.status === 200) {
          this.$message.success('修改成功')
          this.getuserlist()
          this.editVisible = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  created () {
    this.getuserlist()
  }
}
</script>

<style lang='scss' scoped>
.users {
  .el-dialog {
    .el-form{

      .el-form-item__label{
        margin-top: 10px;
      }
       .el-input{
         width: 100%;
       }
    }

  }
  .input-with-select {
    width: 300px;
    height: 40px;
    padding: 10px 0;
    padding-right: 20px;
  }
  .block {
    padding: 20px 0;
  }
}
.el-breadcrumb {
  padding: 20px 0;
}
</style>
