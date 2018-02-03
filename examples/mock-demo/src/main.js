// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// 启动前端虚拟服务,自动判断 dev 环境使用 mock，打包编译时会自动忽略该代码块
if (process.env.NODE_ENV === 'development') {
  require('./mock')
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
