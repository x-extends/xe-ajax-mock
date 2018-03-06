define([
  'xe-ajax-mock'
], function (XEAjaxMock) {
  XEAjaxMock.GET('api/i18n/list', (request, response) => {
    return response.require(request.params.lang === 'zh' ? 'mock/json/api/i18n/list/zh.json' : 'mock/json/api/i18n/list/en.json')
  })

  XEAjaxMock.GET('/api/shopping/findList', function (request, response) {
    return response.require('mock/json/api/shopping/findList/data.json')
  })
  XEAjaxMock.POST('/api/shopping/save', function (request, response) {
    return response.require('mock/json/api/shopping/save/data.json')
  })
  XEAjaxMock.DELETE('/api/shopping/del/{id}', function (request, response) {
    response.status = 500 // 设置为请求错误
    return response.require('mock/json/api/shopping/del/data.json')
  })

  XEAjaxMock.GET('/api/user/list/page/{pageSize}/{currentPage}', function (request, response, context) {
    return response.require('mock/json/api/user/list/page/data.json').then(function (resp) {
      // 动态设置分页信息
      resp.body.page = context.pathVariable
      return resp
    })
  })
  XEAjaxMock.POST('/api/user/save', function (request, response) {
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
