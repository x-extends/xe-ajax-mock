define(['xe-ajax', 'xe-ajax-mock', 'mocksetup'], function (XEAjax, XEAjaxMock) {
  XEAjaxMock.GET('/api/shopping/findList', (request, response) => {
    return XEAjax.getJSON('mock/json/api/shopping/findList/data.json').then(function (data) {
      response.body = data
      response.headers = {'Content-Type': 'application/javascript; charset=UTF-8'} // 设置响应头
      return response
    })
  })
  XEAjaxMock.POST('/api/shopping/save', (request, response) => {
    return XEAjax.getJSON('mock/json/api/shopping/save/data.json').then(function (data) {
      response.body = data
      return response
    })
  })
  XEAjaxMock.DELETE('/api/shopping/del/{id}', (request, response) => {
    return XEAjax.getJSON('mock/json/api/shopping/del/data.json').then(function (data) {
      response.status = 500
      response.body = data
      return response
    })
  })
})
