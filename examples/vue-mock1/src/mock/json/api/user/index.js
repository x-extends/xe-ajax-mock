import { GET, POST } from 'xe-ajax-mock'

GET('/api/user/list/page/{pageSize}/{currentPage}', require('./list/page/data.json'))
POST('/api/user/save', (request, response) => {
  // 模拟后台逻辑
  if (request.body.password && request.body.password.length >= 6) {
    response.body = require('./save/data.json')
  } else {
    response.status = 500
    response.body = {message: '密码不能小于六位数'}
  }
  return response
})
