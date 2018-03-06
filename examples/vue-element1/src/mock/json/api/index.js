import { GET, POST } from 'xe-ajax-mock'

GET('api/role/list', require('./role/list/data.json'))
GET('api/role/findRoles', require('./role/findRoles/data.json'))

GET('api/user/list', require('./user/list/data.json'))
POST('api/user/save', (request, response) => {
  // 模拟后台简单进行校验
  if (request.body.name) {
    response.body = require('./user/save/data.json')
  } else {
    response.status = 500
    response.body = {msg: 'error'}
  }
  return response
})
