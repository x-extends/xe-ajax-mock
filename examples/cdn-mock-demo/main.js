require.config({
  paths: {
    'vue': 'static/vue',
    'vue-router': 'static/vue-router',
    'xe-utils': 'static/xe-utils',
    'xe-ajax': 'static/xe-ajax',
    'xe-ajax-mock': 'static/xe-ajax-mock',
    'text': 'static/require-text',

    'mock': 'mock/index',
    'mocksetup': 'mock/mocksetup',
    'shopping-mock': 'mock/json/api/shopping/index',
    'user-mock': 'mock/json/api/user/index',
    'jsonp-user-mock': 'mock/jsonp/xuliangzhan.com/index',

    'router': 'router/index',
    'home': 'views/home'
  }
})

require(['vue', 'xe-ajax', 'xe-ajax-mock', 'router', 'mock'], function (Vue, XEAjax, XEAjaxMock, router) {
  // 设置默认参数
  XEAjax.setup({
    baseURL: 'http://xuliangzhan.com'
  })

  var $app = new Vue({
    el: '#app',
    router: router
  })
})
