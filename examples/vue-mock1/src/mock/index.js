import XEAjax from 'xe-ajax'
import XEAjaxMock from 'xe-ajax-mock'

// 导入 Mock 配置文件
import './setup'
import './json/api'
import './jsonp/xuliangzhan.com/api'
import './error'

// 安装 Mock
XEAjax.use(XEAjaxMock)
