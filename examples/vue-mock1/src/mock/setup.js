import XEAjaxMock from 'xe-ajax-mock'

// Mock 参数设置
XEAjaxMock.setup({
  // 启用数据模板自动编译
  template: true,
  // 启用路径参数类型自动解析
  pathVariable: 'auto',
  // 服务请求时间范围
  timeout: '100-1000',
  // 设置默认响应头
  headers: {
    'Content-Type': 'application/javascript; charset=UTF-8'
  },
  // 控制台打印错误日志
  error: true,
  // 控制台打印请求详细日志
  log: true
})
