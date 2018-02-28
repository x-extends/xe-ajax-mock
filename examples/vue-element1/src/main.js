// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import VueI18n from 'vue-i18n'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import XEAjax from 'xe-ajax'

Vue.use(Element)
Vue.use(VueI18n)
Vue.config.productionTip = false

// 启动前端虚拟服务
if (process.env.NODE_ENV === 'development') {
  require('./mock')
}

XEAjax.interceptors.request.use((request, next) => {
  // 请求之前拦截器
  next()
})

XEAjax.interceptors.response.use((response, next) => {
  // 响应之后拦截器
  next()
})

// 初始化国际化
const i18n = new VueI18n({
  locale: 'en', // 语言标识
  messages: {
    en: {}
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
