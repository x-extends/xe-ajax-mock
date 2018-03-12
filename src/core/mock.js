import { isArray, isFunction, getScopeNumber, arrayEach, objectAssign, getBaseURL, getLocatOrigin } from '../core/util'
import { xefetch, XEXMLHttpRequest } from '../adapters/fetch'
import { xejsonp } from '../adapters/jsonp'
import { XETemplate } from '../template'
import { getXHRResponse } from '../core/response'

var defineMockServices = []

export var setupDefaults = {
  baseURL: getBaseURL(),
  template: false,
  pathVariable: true,
  timeout: '20-400',
  headers: null,
  error: true,
  log: 'development' !== 'production'
}

function XEMockService (path, method, response, options) {
  if (path && method) {
    this.path = path
    this.method = method
    this.time = 0
    this.response = response
    this.options = options
    this.asyncTimeout = null
  } else {
    if (this.options.error) {
      console.error('path and method cannot be empty')
    }
  }
}

objectAssign(XEMockService.prototype, {
  send: function (mockXHR, request) {
    var mock = this
    this.time = getScopeNumber(this.options.timeout)
    return getXHRResponse(mock, request).then(function (response) {
      mock.reply(mockXHR, request, response)
    })
  },
  reply: function (mockXHR, request, response) {
    if (mockXHR.readyState !== 4) {
      var url = request.getUrl()
      mockXHR.status = response.status
      mockXHR.responseText = mockXHR.response = response.body ? JSON.stringify(response.body) : ''
      mockXHR.responseHeaders = response.headers
      mockXHR.readyState = 4
      if (this.options.error && (mockXHR.status < 200 || mockXHR.status >= 300)) {
        console.error(request.method + ' ' + url + ' ' + mockXHR.status)
      }
      if (isFunction(mockXHR.onreadystatechange)) {
        mockXHR.onreadystatechange()
      }
      if (this.options.log) {
        console.info('[XEAjaxMock] URL: ' + url + '\nMethod: ' + request.method + ' => Status: ' + (response ? response.status : 'canceled') + ' => Time: ' + this.time + 'ms')
        console.info(response)
      }
    }
  }
})

function defineMocks (list, options, baseURL, first) {
  if (isArray(list)) {
    arrayEach(list, function (item) {
      if (item.path) {
        if (first && item.path.indexOf('/') === 0) {
          item.path = getLocatOrigin() + item.path
        } else if (first && /\w+:\/{2}.*/.test(item.path)) {
          item.path = item.path
        } else {
          item.path = baseURL.replace(/\/$/, '') + '/' + item.path.replace(/^\//, '')
        }
        if (item.response !== undefined) {
          item.method = String(item.method || 'GET')
          defineMockServices.push(new XEMockService(item.path, item.method, item.response, options))
        }
        defineMocks(item.children, options, item.path)
      }
    })
  }
}

export function mateMockItem (request) {
  var url = (request.getUrl() || '').split(/\?|#/)[0]
  return defineMockServices.find(function (mockItem) {
    if ((mockItem.jsonp ? (mockItem.jsonp === request.jsonp) : true) && request.method.toLowerCase() === mockItem.method.toLowerCase()) {
      var done = false
      var pathVariable = []
      var matchs = url.match(new RegExp(mockItem.path.replace(/{[^{}]+}/g, function (name) {
        pathVariable.push(name.substring(1, name.length - 1))
        return '([^/]+)'
      }).replace(/\/[*]{2}/g, '/.+').replace(/\/[*]{1}/g, '/[^/]+') + '/?$'))
      mockItem.pathVariable = {}
      done = matchs && matchs.length === pathVariable.length + 1
      if (mockItem.options.pathVariable && done && pathVariable.length) {
        arrayEach(pathVariable, function (key, index) {
          mockItem.pathVariable[key] = parsePathVariable(matchs[index + 1], mockItem)
        })
      }
      return done
    }
  })
}

function parsePathVariable (val, mockItem) {
  if (val && mockItem.options.pathVariable === 'auto') {
    if (!isNaN(val)) {
      return parseFloat(val)
    } else if (val === 'true') {
      return true
    } else if (val === 'false') {
      return false
    }
  }
  return val
}

/**
  * XEAjaxMock 虚拟服务
  *
  * @param Array/String path 路径数组/请求路径
  * @param String method 请求方法
  * @param Object/Function response 数据或返回数据方法
  * @param Object options 参数
  */
function XEAjaxMock (path, method, response, options) {
  var opts = objectAssign({}, setupDefaults, options)
  defineMocks(isArray(path) ? (options = method, path) : [{path: path, method: method, response: response}], opts, opts.baseURL, true)
  return XEAjaxMock
}

/**
 * 设置全局参数
 *
 * @param Object options 参数
 */
export function setup (options) {
  objectAssign(setupDefaults, options)
}

/**
 * 初始化安装
 */
export function install (XEAjax) {
  XEAjax.setup({
    $fetch: xefetch,
    $XMLHttpRequest: XEXMLHttpRequest,
    $jsonp: xejsonp
  })
}

function createDefine (method) {
  return function (url, response, options) {
    return XEAjaxMock(url, method, response, options)
  }
}

export function JSONP (url, response, options) {
  return XEAjaxMock(url, 'GET', response, objectAssign({jsonp: 'callback'}, options))
}

export var template = XETemplate
export var Mock = XEAjaxMock
export var GET = createDefine('GET')
export var POST = createDefine('POST')
export var PUT = createDefine('PUT')
export var DELETE = createDefine('DELETE')
export var PATCH = createDefine('PATCH')
export var HEAD = createDefine('HEAD')
