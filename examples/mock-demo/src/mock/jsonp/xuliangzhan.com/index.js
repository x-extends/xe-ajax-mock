import { JSONP } from 'xe-ajax-mock'

JSONP('http://xuliangzhan.com/jsonp/user/list', (request, response) => {
  response.body = 500
  response.body = require('./jsonp/user/list/data.json')
  return response
})
JSONP('http://xuliangzhan.com/jsonp/user/message', (request, response) => {
  response.body = require('./jsonp/user/message/data.json')
  return response
})
