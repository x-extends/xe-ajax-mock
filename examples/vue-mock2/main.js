require.config({
  paths: {
    'vue': 'https://cdn.jsdelivr.net/npm/vue@2.5.2/dist/vue',
    'vue-router': 'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router',
    'vue-i18n': 'https://cdn.jsdelivr.net/npm/vue-i18n@7.4.0/dist/vue-i18n',
    'xe-utils': 'https://cdn.jsdelivr.net/npm/xe-utils/dist/xe-utils',
    'xe-ajax': 'https://cdn.jsdelivr.net/npm/xe-ajax/dist/xe-ajax',
    'xe-ajax-mock': 'https://cdn.jsdelivr.net/npm/xe-ajax-mock/dist/xe-ajax-mock',
    'text': 'static/require/require-text',

    'lang-zh': 'static/lang/zh',
    'lang-en': 'static/lang/en',

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
  'router',
  'lang-zh',
  'lang-en',
  'mock'
].concat(location.hostname.indexOf('localhost') === 0 ? ['mock'] : []), function (Vue, VueI18n, XEAjax, router, zhMap, enMap) {
  Vue.use(VueI18n)

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

  // 初始化国际化
  var i18n = new VueI18n({
    locale: 'zh',
    messages: {
      zh: zhMap,
      en: enMap
    }
  })

  return new Vue({
    el: '#app',
    i18n: i18n,
    router: router
  })
})
