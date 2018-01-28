import XEAjax from 'xe-ajax'
import XEAjaxMock from 'xe-ajax-mock'

// 安装
XEAjax.use(XEAjaxMock)

// 设置全局参数
XEAjaxMock.setup({
  baseURL: 'http://localhost:8080', // 域名(可选)
  timeout: '100-1000' // 服务请求时间范围
})

// 导入虚拟服务配置
require('./json/services/shopping')
require('./json/services/user')
