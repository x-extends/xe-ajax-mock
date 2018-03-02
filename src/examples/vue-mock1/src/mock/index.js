import XEAjax from 'xe-ajax'
import XEAjaxMock from 'xe-ajax-mock'

// 导入 Mock 配置文件
import './setup'
import './json/api/shopping'
import './json/api/user'
import './jsonp/xuliangzhan.com'

// 安装 Mock
XEAjax.use(XEAjaxMock)
