import { GET, POST } from 'xe-ajax-mock'

GET('services/user/list/page/{pageSize}/{currentPage}', (request, xhr) => {
  xhr.response = require('./list/page/data.json')
  return xhr
})

POST('services/user/save', (request, xhr) => {
  // 模拟后台逻辑
  if (request.body.password && request.body.password.length > 6) {
    xhr.response = require('./save/data.json')
  } else {
    xhr.status = 500
    xhr.response = {message: '密码不能小于六位数'}
  }
  return xhr
})
