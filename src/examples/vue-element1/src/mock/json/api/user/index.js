import { GET, POST } from 'xe-ajax-mock'

GET('api/user/list', require('./list/data.json'))
POST('api/user/save', (request, response) => {
  // 模拟后台简单进行校验
  if (request.body.name) {
    response.body = require('./save/data.json')
  } else {
    response.status = 500
    response.body = {msg: 'error'}
  }
  return response
})
