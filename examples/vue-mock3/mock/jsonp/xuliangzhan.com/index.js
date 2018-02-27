define([
  'xe-ajax-mock'
], function (XEAjaxMock) {
  XEAjaxMock.JSONP('http://xuliangzhan.com/api/user/list', function (request, response) {
    response.status = 500 // 设置为请求错误
    return response.require('mock/jsonp/xuliangzhan.com/api/user/list/data.json')
  })
  XEAjaxMock.JSONP('http://xuliangzhan.com/api/user/message', function (request, response) {
    return response.require('mock/jsonp/xuliangzhan.com/api/user/message/data.json')
  })
})
