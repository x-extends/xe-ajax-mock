define([
  'xe-ajax',
  'xe-ajax-mock'
], function (XEAjax, XEAjaxMock) {
  XEAjaxMock
  .JSONP('http://xuliangzhan.com/api/user/list', function (request, response) {
    return response.require('mock/jsonp/xuliangzhan.com/api/user/list/data.json')
  })
  .JSONP('http://xuliangzhan.com/api/user/message', function (request, response) {
    return response.require('mock/jsonp/xuliangzhan.com/api/user/message/data.json')
  })
})
