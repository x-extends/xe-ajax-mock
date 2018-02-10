define([
  'xe-ajax-mock'
], function (XEAjaxMock) {
  XEAjaxMock.GET('/api/shopping/findList', (request, response) => {
    response.headers = {'Content-Type': 'application/javascript; charset=UTF-8'} // 设置响应头
    return response.require('mock/json/api/shopping/findList/data.json')
  })
  XEAjaxMock.POST('/api/shopping/save', (request, response) => {
    return response.require('mock/json/api/shopping/save/data.json') // 请求响应本地json数据
  })
  XEAjaxMock.DELETE('/api/shopping/del/{id}', (request, response) => {
    response.status = 500 // 设置为请求错误
    return response.require('mock/json/api/shopping/del/data.json')
  })
})
