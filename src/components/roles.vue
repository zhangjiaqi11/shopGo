<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <hr />
    <el-button class="btn1" type="success" plain @click="showAddDia">添加角色</el-button>

    <!-- 表格 -->
    <el-table ref="singleTable" :data="rolesList" highlight-current-row style="width: 100%">
      <el-table-column type="expand">
        <template v-slot:default="{row}">
          <p v-if='row.children.length===0'>暂无权限</p>
          <el-row class="v1" v-for="v1 in row.children" :key="v1.id">
            <el-col :span="4">
              <el-tag @close="delRoles(row,v1.id)" closable>{{v1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="v2" v-for="v2 in v1.children" :key="v2.id">
                <el-col :span="4">
                  <el-tag @close="delRoles(row,v2.id)" closable type="success">{{v2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="delRoles(row,v3.id)"
                    closable
                    class="v3"
                    type="warning"
                    v-for="v3 in v2.children"
                    :key="v3.id"
                  >{{v3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="roleName" label="角色名称"></el-table-column>
      <el-table-column property="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button type="primary" @click="showEditDia(row)" size="small" plain icon="el-icon-edit"></el-button>
          <el-button type="danger" @click="delRole(row,$event)" size="small" plain icon="el-icon-delete"></el-button>
          <el-button
            type="success"
            @click="assign(row)"
            size="small"
            plain
            icon="el-icon-check"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="30%">
      <el-tree
        :data="data"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加与修改对话框 -->
    <el-dialog
    :title="changeRole"
    :visible.sync="saveVisible"
    width="40%">

  <el-form :rules="rules" ref="form" :model="form" label-width="80px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="form.roleDesc" placeholder="请输入角色描述"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="saveVisible = false">取 消</el-button>
    <el-button @click="saveRole" type="primary" >确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      dialogVisible: false,
      data: [],
      roleId: '',
      changeRole: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      saveVisible: false,
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.rolesList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRoles (row, rightId) {
      const { meta, data } = await this.$axios.delete(
        `roles/${row.id}/rights/${rightId}`
      )
      if (meta.status === 200) {
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assign (row) {
      this.dialogVisible = true
      this.roleId = row.id
      const { meta, data } = await this.$axios.get(`rights/tree`)
      if (meta.status === 200) {
        this.data = data
        const arr = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              arr.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(arr)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRight () {
      const ids = this.$refs.tree.getCheckedKeys()
      const halfIds = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfIds].join()
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.$message.success('分配角色成功')
        this.dialogVisible = false
        this.getRolesList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRole (row, e) {
      if (e.target.nodeName === 'BUTTON') {
        e.target.blur()
      } else {
        e.target.parentNode.blur()
      }
      try {
        await this.$confirm('确认删除吗', '警告', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${row.id}`)
        if (meta.status === 200) {
          this.$message.success('删除成功')
          this.getRolesList()
        } else {
          this.$message.warning(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showAddDia () {
      this.saveVisible = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
      this.changeRole = '添加角色'
    },
    showEditDia (row) {
      this.saveVisible = true
      this.changeRole = '修改角色'
      this.form.roleName = row.roleName
      this.form.roleDesc = row.roleDesc
      this.form.id = row.id
    },
    async saveRole () {
      const { id } = this.form
      const method = this.changeRole === '修改角色' ? 'put' : 'post'
      const url = this.changeRole === '修改角色' ? `roles/${id}` : 'roles'
      const { meta } = await this.$axios[method](url, this.form)
      if (meta.status === 200 || meta.status === 201) {
        this.$message.success('操作成功')
        this.saveVisible = false
        this.getRolesList()
      } else {
        this.$message.warning(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.roles {
  .btn1 {
    margin: 10px;
    margin-left: 0;
  }
  .v1 {
    margin-bottom: 10px;
    border-bottom: 1px dotted #ccc;
  }
  .v2 {
    margin-bottom: 5px;
  }
  .v3 {
    margin-bottom: 5px;
    margin-right: 5px;
  }
}
</style>
