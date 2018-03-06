import { JSONP } from 'xe-ajax-mock'

JSONP('http://xuliangzhan.com/api/user/list', require('./user/list/data.json'))
JSONP('http://xuliangzhan.com/api/user/message', require('./user/message/data.json'))
