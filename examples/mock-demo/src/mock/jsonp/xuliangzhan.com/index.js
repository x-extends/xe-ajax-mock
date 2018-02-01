import { JSONP } from 'xe-ajax-mock'

JSONP('http://xuliangzhan.com/jsonp/user/message', (request, response) => {
  response.body = require('./jsonp/user/message/data.json')
  return response
})
