import { GET, POST, DELETE } from 'xe-ajax-mock'

GET('/api/shopping/findList', require('./findList/data.json'))
POST('/api/shopping/save', require('./save/data.json'))
DELETE('/api/shopping/del/{id}', require('./del/data.json'))
