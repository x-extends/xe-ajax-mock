import { XETemplate } from '../template'
import { Mock, JSONP, HEAD, GET, POST, PUT, DELETE, PATCH } from './index'

function asyncRequire (url) {
  return function (response) {
    return response.require(url)
  }
}

export var exportMethods = {
  require: asyncRequire,
  template: XETemplate,
  Mock: Mock,
  JSONP: JSONP,
  HEAD: HEAD,
  GET: GET,
  POST: POST,
  PUT: PUT,
  DELETE: DELETE,
  PATCH: PATCH
}
