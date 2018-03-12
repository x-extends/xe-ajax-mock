define([
  'xe-ajax-mock'
], function (XEAjaxMock) {
  XEAjaxMock
  .GET('api/i18n/list', function (request, response) {
    return response.require(request.params.lang === 'zh' ? 'mock/json/api/i18n/list/zh.json' : 'mock/json/api/i18n/list/en.json')
  })

  .GET('/api/shopping/findList', function (request, response) {
    return response.require('mock/json/api/shopping/findList/data.json')
  })
  .POST('/api/shopping/save', function (request, response) {
    return response.require('mock/json/api/shopping/save/data.json')
  })
  .DELETE('/api/shopping/del/{id}', function (request, response) {
    return response.require('mock/json/api/shopping/del/data.json')
  })

  .GET('/api/user/list/page/{pageSize}/{currentPage}', function (request, response, context) {
    return response.require('mock/json/api/user/list/page/data.json')
  })
  .POST('/api/user/save', function (request, response) {
      // 简单模拟后台校验
    if (request.body.password && request.body.password.length >= 6) {
      response.status = 200
      return response.require('mock/json/api/user/save/data.json')
    }
    response.status = 500
    response.body = {message: '密码不能小于六位数'}
    return response
  })
})
