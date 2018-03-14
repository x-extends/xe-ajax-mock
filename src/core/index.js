import { objectAssign } from '../core/util'
import { XETemplate } from '../template'
import { XEAjaxMock } from './mock'

function createDefine (method) {
  return function (url, response, options) {
    return Mock(url, method, response, options)
  }
}

export function JSONP (url, response, options) {
  return Mock(url, 'GET', response, objectAssign({jsonp: 'callback'}, options))
}

export var template = XETemplate
export var Mock = XEAjaxMock
export var GET = createDefine('GET')
export var POST = createDefine('POST')
export var PUT = createDefine('PUT')
export var DELETE = createDefine('DELETE')
export var PATCH = createDefine('PATCH')
export var HEAD = createDefine('HEAD')
