import { GET } from 'xe-ajax-mock'

GET('/api/shopping/findList', (request, response) => {
  response.body = require('./findList/data.json')
  response.headers = {'Content-Type': 'application/javascript; charset=UTF-8'} // 设置响应头
  return response
})
