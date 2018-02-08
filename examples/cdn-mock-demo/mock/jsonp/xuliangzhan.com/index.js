define(['xe-ajax', 'xe-ajax-mock', 'mocksetup'], function (XEAjax, XEAjaxMock) {
  XEAjaxMock.JSONP('http://xuliangzhan.com/api/user/list', (request, response, context) => {
    return XEAjax.getJSON('mock/jsonp/xuliangzhan.com/api/user/list/data.json').then(function (data) {
      response.body = 500
      response.body = data
      return response
    })
  })
  XEAjaxMock.JSONP('http://xuliangzhan.com/api/user/message', (request, response) => {
    return XEAjax.getJSON('mock/jsonp/xuliangzhan.com/api/user/message/data.json').then(function (data) {
      response.body = data
      return response
    })
  })
})
