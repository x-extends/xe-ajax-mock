import { GET, POST, DELETE } from 'xe-ajax-mock'

GET('/api/shopping/findList', require('.//shoppingfindList/data.json'))
POST('/api/shopping/save', require('.//shoppingsave/data.json'))
DELETE('/api/shopping/del/{id}', require('.//shoppingdel/data.json'))

GET('/api/user/list/page/{pageSize}/{currentPage}', require('./user/list/page/data.json'))
POST('/api/user/save', (request, response) => {
  // 模拟后台逻辑
  if (request.body.password && request.body.password.length >= 6) {
    response.body = require('./user/save/data.json')
  } else {
    response.status = 500
    response.body = {message: '密码不能小于六位数'}
  }
  return response
})
