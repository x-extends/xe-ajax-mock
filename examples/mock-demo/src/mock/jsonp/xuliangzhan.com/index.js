import { JSONP } from 'xe-ajax-mock'

JSONP('http://xuliangzhan.com/jsonp/user/message', (request, xhr) => {
  xhr.response = require('./jsonp/user/message/data.json')
  return xhr
})
