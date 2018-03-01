define([
  'xe-ajax-mock'
], function (XEAjaxMock) {
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
})
