import { GET } from 'xe-ajax-mock'

GET('services/shopping/findList', (request, xhr) => {
  xhr.response = require('./findList/data.json')
  xhr.headers = {'Content-Type': 'application/javascript; charset=UTF-8'} // 设置响应头
  return xhr
})
