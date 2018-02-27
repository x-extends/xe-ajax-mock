import XEAjaxMock from 'xe-ajax-mock'

// 设置全局参数
XEAjaxMock.setup({
  timeout: '100-1000', // 服务请求时间范围
  // 设置默认响应头
  headers: {
    'Content-Type': 'application/javascript; charset=UTF-8'
  },
  error: true, // 控制台打印 Mock Error 日志
  log: true // 控制台打印 Mock Request 日志
})
