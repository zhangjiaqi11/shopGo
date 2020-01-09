module.exports = {
  devServer: {
    open: true,
    port: 3000
  },
  configureWebpack: {
    // 配置打包的排除项, 从外部引入
    externals: {
      // 思考: import Vue from 'vue' 从哪引入了
      // 表示导入 vue 时, 指向了全局变量 Vue
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      axios: 'axios'
    }
  }
}
