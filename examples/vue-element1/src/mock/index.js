import XEAjax from 'xe-ajax'
import XEAjaxMock from 'xe-ajax-mock'

// 导入 Mock 配置文件
import './setup'
import './json/api/user'
import './json/api/role'
import './error'

// 安装 Mock
XEAjax.use(XEAjaxMock)
