define(['xe-ajax', 'xe-ajax-mock', 'mocksetup'], function (XEAjax, XEAjaxMock) {
  XEAjaxMock.GET('/api/user/list/page/{pageSize}/{currentPage}', (request, response, context) => {
    return XEAjax.getJSON('mock/json/api/user/list/page/data.json').then(function (data) {
      // 通过 context 获取路径参数 context.pathVariable
      response.body = data
      return response
    })
  })
  XEAjaxMock.POST('/api/user/save', (request, response) => {
      // 模拟后台逻辑
    if (request.body.password && request.body.password.length > 6) {
      return XEAjax.getJSON('mock/json/api/user/save/data.json').then(function (data) {
        response.body = data
        return response
      })
    }
    response.status = 500
    response.body = {message: '密码不能小于六位数'}
    return response
  })
})
