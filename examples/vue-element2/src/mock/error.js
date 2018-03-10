import { GET, POST } from 'xe-ajax-mock'

GET('api/*.+', {status: 404, body: {message: '服务不存在！'}})
POST('api/*.+', {status: 404, body: {message: '服务不存在！'}})
