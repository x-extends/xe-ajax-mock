import { JSONP } from 'xe-ajax-mock'

JSONP('http://xuliangzhan.com/api/user/list', require('./api/user/list/data.json'))
JSONP('http://xuliangzhan.com/api/user/message', require('./api/user/message/data.json'))
