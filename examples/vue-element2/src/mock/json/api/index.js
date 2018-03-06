import { GET, POST } from 'xe-ajax-mock'

GET('api/role/list', require('./role/list/data.json'))
GET('api/role/findRoles', require('./role/findRoles/data.json'))

GET('api/user/list', require('./user/list/data.json'))
POST('api/user/save', require('./user/save/data.json'))

GET('api/i18n/list', (request, response) => {
  response.body = request.params.lang === 'zh' ? require('./i18n/list/zh.json') : require('./i18n/list/en.json')
  return response
})
