require.config({
  paths: {
    'vue': 'static/vue',
    'vue-router': 'static/vue-router',
    'xe-utils': 'static/xe-utils',
    'xe-ajax': 'static/xe-ajax',
    'xe-ajax-mock': 'static/xe-ajax-mock',
    'text': 'static/require-text',

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
  'router',
  'mock'
], function (Vue, XEAjax, router) {
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
