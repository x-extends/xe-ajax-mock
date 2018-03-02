import { GET } from 'xe-ajax-mock'

GET('api/role/list', require('./list/data.json'))
GET('api/role/findRoles', require('./findRoles/data.json'))
