<template>
  <div class="login">
    <el-form  :rules="rules" ref='form' :model="form" label-width="80px">
      <el-form-item  label="用户名" prop="username">
        <el-input  @keyup.enter.native="login" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input  @keyup.enter.native="login" type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-button @click='login' type="primary">登陆</el-button>
      <el-button @click='reset'>重置</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        password: '',
        username: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    login () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.$axios.post('login', this.form).then(res => {
          const { meta, data } = res
          if (meta.status === 400) {
            this.$message({
              message: '登陆失败',
              type: 'error',
              duration: 1500
            })
          } else {
            this.$message({
              message: '登陆成功',
              type: 'success',
              duration: 1500
            })
            localStorage.setItem('token', data.token)
            this.$router.push('./index')
          }
        })
      })
    }
  }
}
</script>

<style lang='scss' >

html,
body,
#app,
.login {
  height: 100%;
  width: 100%;
}
.login {
  background:url(../assets/timg.jpeg);
  overflow: hidden;
  .el-form {
  padding: 75px 20px 20px;
  margin: 0 auto;
  margin-top: 200px;
  width: 400px;
  background-color: #fff;
  border-radius: 20px;
  position: relative;
  .el-button {
    margin-left: 80px;
    margin-bottom: 20px;
  }
  img {
    width: 115px;
    height: 115px;
    border-radius: 50%;
    position: absolute;
    top: -70px;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid orange;
  }
}
}

</style>
