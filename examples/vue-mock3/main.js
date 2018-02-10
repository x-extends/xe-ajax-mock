require.config({
  paths: {
    'vue': 'static/vue/vue',
    'vue-router': 'static/vue-router/vue-router',
    'xe-utils': 'static/xe-utils/xe-utils',
    'vxe-utils': 'static/vxe-utils/vxe-utils',
    'xe-ajax': 'static/xe-ajax/xe-ajax',
    'vxe-ajax': 'static/vxe-ajax/vxe-ajax',
    'xe-ajax-mock': 'static/xe-ajax-mock/xe-ajax-mock',
    'text': 'static/require/require-text',

    'mock': 'mock/index',
    'shopping-mock': 'mock/json/api/shopping/index',
    'user-mock': 'mock/json/api/user/index',
    'jsonp-user-mock': 'mock/jsonp/xuliangzhan.com/index',

    'router': 'router/index',
    'home': 'views/home'
  }
})

require([
  'vue',
  'xe-ajax',
  'vxe-ajax',
  'xe-utils',
  'vxe-utils',
  'router',
  'mock'
], function (Vue, XEAjax, VXEAjax, XEUtils, VXEUtils, router) {
  // 安装
  Vue.use(VXEAjax, XEAjax, true) // 如果第三个参数设置为true，则启动模拟 Promise 模式，通过 this.$ajax 发起的请求 this 默认指向当前vue实例。
  Vue.use(VXEUtils, XEUtils)

  // 设置默认参数
  XEAjax.setup({
    bodyType: 'FORM_DATA'// 默认已json方式提交，修改为form data方式提交,根据后台支持情况设置
  })

  XEAjax.interceptors.request.use(function (request, next) {
    // 请求之前拦截器
    next()
  })

  XEAjax.interceptors.response.use(function (response, next) {
    // 响应之后拦截器
    next()
  })

  var $app = new Vue({
    el: '#app',
    router: router
  })
})
