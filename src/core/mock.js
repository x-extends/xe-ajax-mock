import { isFunction, isArray, arrayEach, objectAssign, getLocatOrigin, getBaseURL } from './util'
import { xefetch, XEXMLHttpRequest } from '../adapters/fetch'
import { xejsonp } from '../adapters/jsonp'
import { XEMockResponse } from './response'

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

/**
  * XEAjaxMock 虚拟请求
  *
  * @param Array/String path 路径数组/请求路径
  * @param String method 请求方法
  * @param Object/Function response 数据或返回数据方法
  * @param Object options 参数
  */
export function XEAjaxMock (path, method, response, options) {
  var opts = objectAssign({}, setupDefaults, options)
  defineMocks(isArray(path) ? (options = method, path) : [{path: path, method: method, response: response}], opts, opts.baseURL, true)
  return XEAjaxMock
}

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
          defineMockServices.push(new XEMock(item.path, item.method, item.response, options))
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

export function XEMock (path, method, response, options) {
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

Object.assign(XEMock.prototype, {
  getMockResponse: function (request) {
    var mockItem = this
    return new Promise(function (resolve, reject) {
      mockItem.asyncTimeout = setTimeout(function () {
        if (!request.$complete) {
          if (isFunction(mockItem.response)) {
            return Promise.resolve(mockItem.response(request, new XEMockResponse(mockItem, request, null, 200), mockItem)).then(function (response) {
              resolve(new XEMockResponse(mockItem, request, response, 200))
            })
          }
          return Promise.resolve(mockItem.response).then(function (response) {
            resolve(new XEMockResponse(mockItem, request, response, 200))
          }).catch(function (response) {
            reject(new XEMockResponse(mockItem, request, response, 500))
          })
        }
      }, mockItem.time)
    })
  },
  outMockLog: function (request, response) {
    var url = request.getUrl()
    if (this.options.error && (response.status < 200 || response.status >= 300)) {
      console.error(request.method + ' ' + url + ' ' + response.status)
    }
    if (this.options.log) {
      console.info('[XEAjaxMock] URL: ' + url + '\nMethod: ' + request.method + ' => Status: ' + (response ? response.status : 'canceled') + ' => Time: ' + this.time + 'ms')
      console.info(response)
    }
  }
})
