define([
  'xe-ajax-mock'
], function (XEAjaxMock) {
  // Mock 参数设置
  XEAjaxMock.setup({
    template: true,
    pathVariable: 'auto',
    timeout: '100-1000',
    error: true,
    log: true
  })
})
