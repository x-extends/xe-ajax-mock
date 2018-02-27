import XEAjax from 'xe-ajax'
import XEAjaxMock from 'xe-ajax-mock'

// 导入虚拟服务配置
import './json/api/shopping'
import './json/api/user'
import './jsonp/xuliangzhan.com'

// 安装
XEAjax.use(XEAjaxMock)
