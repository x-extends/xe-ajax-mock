require.config({
  paths: {
    'vue': 'https://cdn.jsdelivr.net/npm/vue@2.5.2/dist/vue',
    'vue-router': 'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router',
    'vue-i18n': 'https://cdn.jsdelivr.net/npm/vue-i18n@7.4.0/dist/vue-i18n',
    'xe-utils': 'https://cdn.jsdelivr.net/npm/xe-utils/dist/xe-utils',
    'vxe-utils': 'https://cdn.jsdelivr.net/npm/vxe-utils/dist/vxe-utils',
    'xe-ajax': 'https://cdn.jsdelivr.net/npm/xe-ajax/dist/xe-ajax',
    'vxe-ajax': 'https://cdn.jsdelivr.net/npm/vxe-ajax/dist/vxe-ajax',
    'xe-ajax-mock': 'https://cdn.jsdelivr.net/npm/xe-ajax-mock/dist/xe-ajax-mock',
    'text': 'static/require/require-text',

    'mock': 'mock/index',
    'mock-setup': 'mock/setup',
    'mock-error': 'mock/error',
    'mock-json': 'mock/json/api/index',
    'mock-jsonp': 'mock/jsonp/xuliangzhan.com/api/index',

    'router': 'router/index',
    'home': 'views/home'
  },
  shim: {
    mock: {
      deps: ['mock-setup']
    },
    'mock-error': {
      deps: ['mock-json', 'mock-jsonp']
    }
  }
})

define([
  'vue',
  'vue-i18n',
  'xe-ajax',
  'vxe-ajax',
  'xe-utils',
  'vxe-utils',
  'router'
].concat(location.hostname.indexOf('localhost') === 0 ? ['mock'] : []), function (Vue, VueI18n, XEAjax, VXEAjax, XEUtils, VXEUtils, router) {

  Vue.use(VueI18n)
  Vue.use(VXEAjax, XEAjax, true)
  Vue.use(VXEUtils, XEUtils)

  // XEAjax 参数设置
  XEAjax.setup({
    bodyType: 'FORM_DATA',
    credentials: 'include'
  })

  XEAjax.interceptors.request.use(function (request, next) {
    // 请求之前拦截器
    next()
  })

  XEAjax.interceptors.response.use(function (response, next) {
    // 响应之后拦截器
    next()
  })

  var lang = 'zh'
  XEAjax.getJSON('api/i18n/list', {lang: lang}).then(data => {
    // 初始化国际化
    const i18n = new VueI18n({
      locale: lang,
      messages: {
        [lang]: data
      }
    })

    return new Vue({
      el: '#app',
      i18n,
      router: router
    })
  })
})
