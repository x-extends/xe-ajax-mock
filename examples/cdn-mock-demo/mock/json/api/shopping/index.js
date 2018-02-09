define([
  'xe-ajax',
  'xe-ajax-mock'
], function (XEAjax, XEAjaxMock) {
  XEAjaxMock.GET('/api/shopping/findList', (request, response) => {
    return XEAjax.getJSON('mock/json/api/shopping/findList/data.json').then(function (data) {
      response.body = data
      response.headers = {'Content-Type': 'application/javascript; charset=UTF-8'} // 设置响应头
      return response
    })
  })
  XEAjaxMock.POST('/api/shopping/save', (request, response) => {
    return XEAjax.getJSON('mock/json/api/shopping/save/data.json') // 转发为响应本地json数据
  })
  XEAjaxMock.DELETE('/api/shopping/del/{id}', (request, response) => {
    return XEAjax.getJSON('mock/json/api/shopping/del/data.json').then(function (data) {
      response.status = 500 // 设置为请求错误
      response.body = data
      return response
    })
  })
})
