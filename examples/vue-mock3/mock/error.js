define([
  'xe-ajax-mock'
], function (XEAjaxMock) {
  XEAjaxMock.GET('api/**', {status: 404, body: {message: '服务不存在！'}})
  XEAjaxMock.POST('api/**', {status: 404, body: {message: '服务不存在！'}})
})
