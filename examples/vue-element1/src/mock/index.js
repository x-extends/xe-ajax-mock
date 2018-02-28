import XEAjax from 'xe-ajax'
import XEAjaxMock from 'xe-ajax-mock'

// mock define
import './setup'
import './json/api/user'

// use xe-ajax-mock
XEAjax.use(XEAjaxMock)
