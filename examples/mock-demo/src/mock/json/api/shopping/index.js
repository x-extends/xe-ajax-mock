import { GET, POST, DELETE } from 'xe-ajax-mock'

GET('/api/shopping/findList', (request, response) => {
  response.body = require('./findList/data.json')
  response.headers = {'Content-Type': 'application/javascript; charset=UTF-8'} // 设置响应头
  return response
})
POST('/api/shopping/save', (request, response) => {
  response.body = require('./save/data.json')
  return response
})
DELETE('/api/shopping/del/{id}', (request, response) => {
  response.status = 500
  response.body = require('./del/data.json')
  return response
})
