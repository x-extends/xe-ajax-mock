define([
  'xe-ajax-mock'
], function (XEAjaxMock) {
  XEAjaxMock.GET('/api/user/list/page/{pageSize}/{currentPage}', (request, response, context) => {
    // 通过 context 获取路径参数 context.pathVariable
    return response.require('mock/json/api/user/list/page/data.json').then(function (response) {
      // 支持修改最终结果
      response.body = {page: context.pathVariable, result: response.body}
      return response
    })
  })
  XEAjaxMock.POST('/api/user/save', (request, response) => {
      // 模拟后台逻辑
    if (request.body.password && request.body.password.length > 6) {
      response.status = 200
      return response.require('mock/json/api/user/save/data.json')
    }
    response.status = 500
    response.body = {message: '密码不能小于六位数'}
    return response
  })
})
