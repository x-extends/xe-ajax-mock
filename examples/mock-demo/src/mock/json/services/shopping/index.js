import { GET } from 'xe-ajax-mock'

GET('services/shopping/findList', (request, xhr) => {
  xhr.response = require('./findList/data.json')
  return xhr
})
