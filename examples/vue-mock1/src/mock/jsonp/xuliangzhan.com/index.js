import { JSONP } from 'xe-ajax-mock'

JSONP('http://xuliangzhan.com/api/user/list', (request, response) => {
  response.body = 500
  response.body = require('./api/user/list/data.json')
  return response
})
JSONP('http://xuliangzhan.com/api/user/message', (request, response) => {
  response.body = require('./api/user/message/data.json')
  return response
})
