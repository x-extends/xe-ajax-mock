// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import XEAjax, { getJSON } from 'xe-ajax'
import VueI18n from 'vue-i18n'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)
Vue.use(VueI18n)
Vue.config.productionTip = false

// 启动前端虚拟服务,自动判断 DEV 环境使用 Mock，生产环境打包编译时会自动忽略该代码块
if (process.env.NODE_ENV === 'development') {
  require('./mock')
}

// XEAjax 参数设置
XEAjax.setup({
  bodyType: 'JSON_DATA',
  credentials: 'include'
})

XEAjax.interceptors.request.use((request, next) => {
  // 请求之前拦截器
  next()
})

XEAjax.interceptors.response.use((response, next) => {
  // 响应之后拦截器
  next()
})

const lang = 'zh'
getJSON('api/i18n/list', {lang}).then(data => {
  // 初始化国际化
  const i18n = new VueI18n({
    locale: lang,
    messages: {
      [lang]: data
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
})
