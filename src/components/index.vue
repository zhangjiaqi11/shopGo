<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="loginout">
        欢迎光临
        <a @click="loginout" href="javascript:;">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          unique-opened
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-menu"></i> 用户列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/roles">
              <i class="el-icon-menu"></i> 角色列表
            </el-menu-item>
            <el-menu-item index="/rights">
              <i class="el-icon-menu"></i> 权限列表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    loginout () {
      this.$confirm('确定退出吗', '亲', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '成功退出!'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.index,
.el-container {
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    height: 60px;
    display: flex;
    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      h1 {
        font-size: 24px;
        height: 60px;
        line-height: 60px;
        color: #545c64;
        text-align: center;
      }
    }
    .loginout {
      width: 180px;
      font-weight: 700;
      text-align: right;
      padding: 10px;
      line-height: 40px;
      a {
        color: orange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-menu{
        border-right: none;
    }
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
