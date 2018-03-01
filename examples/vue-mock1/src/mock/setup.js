import XEAjaxMock from 'xe-ajax-mock'

// Mock 参数设置
XEAjaxMock.setup({
  // 服务请求时间范围
  timeout: '100-1000',
  // 设置默认响应头
  headers: {
    'Content-Type': 'application/javascript; charset=UTF-8'
  },
  // 控制台打印 Mock Error 日志
  error: true,
  // 控制台打印 Mock Request 日志
  log: true
})
