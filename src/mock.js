import { isArray, isFunction, random, arrayEach, objectAssign } from './util'

var global = typeof window === 'undefined' ? this : window
var defineMockServices = []
var setupDefaults = {
  baseURL: location.origin,
  timeout: '20-400',
  headers: null,
  error: true,
  log: true
}

/**
 * 响应结果
 */
function getXHRResponse (mock, request) {
  return new Promise(function (resolve, reject) {
    mock.asyncTimeout = setTimeout(function () {
      Promise.resolve(isFunction(mock.response) ? mock.response(request, mock.getResponse(null, 200), mock) : mock.response)
        .then(function (response) {
          resolve(mock.getResponse(response, 200))
        }).catch(function (response) {
          reject(mock.getResponse(response, 500))
        })
    }, mock.time)
  })
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
    throw new TypeError('path and method cannot be empty')
  }
}

objectAssign(XEMockService.prototype, {
  getResponse: function (response, status) {
    if (response && response.body !== undefined && response.status !== undefined) {
      response.headers = objectAssign({}, setupDefaults.headers, response.headers)
      return response
    }
    return {status: status, body: response, headers: objectAssign({}, setupDefaults.headers)}
  },
  send: function (mockXHR, request) {
    var mock = this
    this.time = request.timeout || getTime(this.options.timeout)
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
      if (this.options.error && !request.getPromiseStatus(mockXHR)) {
        console.error(request.method + ' ' + url + ' ' + mockXHR.status)
      }
      if (isFunction(mockXHR.onreadystatechange)) {
        mockXHR.onreadystatechange()
      }
      if (this.options.log) {
        console.info('[XEAjaxMock] URL: ' + url + '\nMethod: ' + request.method + ' => Status: ' + (response ? response.status : 'canceled') + ' => Time: ' + this.time + 'ms')
        console.info(response.body)
      }
    }
  }
})

function getTime (timeout) {
  var matchs = timeout.match(/(\d+)-(\d+)/)
  return matchs.length === 3 ? random(parseInt(matchs[1]), parseInt(matchs[2])) : 0
}

function mateMockItem (request) {
  var url = (request.getUrl() || '').split(/\?|#/)[0]
  return defineMockServices.find(function (item) {
    if ((item.jsonp ? (item.jsonp === request.jsonp) : true) && request.method.toLowerCase() === item.method.toLowerCase()) {
      var done = false
      var pathVariable = []
      var matchs = url.match(new RegExp(item.path.replace(/{[^{}]+}/g, function (name) {
        pathVariable.push(name.substring(1, name.length - 1))
        return '([^/]+)'
      }) + '(/.*)?'))
      item.pathVariable = {}
      done = matchs && matchs.length === pathVariable.length + 2 && !matchs[matchs.length - 1]
      if (done && pathVariable.length) {
        arrayEach(pathVariable, function (key, index) {
          item.pathVariable[key] = matchs[index + 1]
        })
      }
      return done
    }
  })
}

function defineMocks (list, options, baseURL) {
  if (isArray(list)) {
    arrayEach(list, function (item) {
      if (item.path) {
        if (!baseURL) {
          baseURL = /\w+:\/{2}.*/.test(item.path) ? '' : options.baseURL
        }
        item.path = (baseURL ? baseURL.replace(/\/$/, '') + '/' : '') + item.path.replace(/^\//, '')
        if (item.response) {
          item.method = String(item.method || 'get')
          defineMockServices.push(new XEMockService(item.path, item.method, item.response, options))
        }
        defineMocks(item.children, options, item.path)
      }
    })
  }
}

/**
 * 虚拟请求 XMLHttpRequest
 */
function XEXMLHttpRequest (request) {
  this.XEMock_MATE = null
  this.XEMock_XHR = null
  this.XEMock_REQUEST = request
}

objectAssign(XEXMLHttpRequest.prototype, {
  timeout: 0,
  status: 0,
  readyState: 0,
  responseHeaders: null,
  ontimeout: null,
  onreadystatechange: null,
  withCredentials: false,
  response: '',
  responseText: '',
  open: function (method, url, async) {
    this.XEMock_MATE = mateMockItem(this.XEMock_REQUEST)
    if (this.XEMock_MATE) {
      this.readyState = 1
      if (isFunction(this.onreadystatechange)) {
        this.onreadystatechange()
      }
    } else {
      this.XEMock_XHR = new XMLHttpRequest()
      this.XEMock_XHR.open(method, url, async)
    }
  },
  send: function (body) {
    if (this.XEMock_MATE) {
      this.XEMock_MATE.send(this, this.XEMock_REQUEST)
    } else {
      this.XEMock_XHR.withCredentials = this.withCredentials
      this.XEMock_XHR.send(body)
    }
  },
  abort: function (response) {
    var mockXHR = this
    setTimeout(function () {
      if (mockXHR.XEMock_MATE) {
        if (mockXHR.readyState !== 0) {
          clearTimeout(mockXHR.XEMock_MATE.asyncTimeout)
          mockXHR.XEMock_MATE.reply(mockXHR, mockXHR.XEMock_REQUEST, response || {status: 0, response: ''})
          mockXHR.readyState = 0
        }
      } else {
        mockXHR.XEMock_XHR.abort()
      }
    })
  },
  setRequestHeader: function (name, value) {
    if (this.XEMock_XHR) {
      this.XEMock_XHR.setRequestHeader(name, value)
    }
  },
  getAllResponseHeaders: function () {
    var result = ''
    var responseHeader = this.responseHeaders
    if (responseHeader) {
      for (var key in responseHeader) {
        if (responseHeader.hasOwnProperty(key)) {
          result += key + ': ' + responseHeader[key] + '\n'
        }
      }
    }
    return result
  }
})

/**
 * 虚拟请求 jsonp
 */
function sendJsonpMock (script, request) {
  var mock = mateMockItem(request)
  if (mock) {
    mock.time = request.timeout || getTime(mock.options.timeout)
    return getXHRResponse(mock, request).then(function (response) {
      var url = request.getUrl()
      if (request.getPromiseStatus(response)) {
        global[request.jsonpCallback](response.body)
        if (mock.options.log) {
          console.info('[XEAjaxMock] URL: ' + url + '\nMethod: ' + request.method + ' => Status: ' + (response ? response.status : 'canceled') + ' => Time: ' + mock.time + 'ms')
          console.info(response.body)
        }
      } else {
        script.onerror({type: 'error'})
        if (mock.options.error) {
          console.error('JSONP ' + url + ' ' + response.status)
        }
      }
    })
  } else {
    document.body.appendChild(script)
  }
}

/**
 * jsonp 请求结束
 * @param { Element } script script节点
 * @param { XEResquest } request 请求
 */
function sendEndJsonpMock (script, request) {
  var mock = mateMockItem(request)
  if (!mock) {
    document.body.removeChild(script)
  }
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
  defineMocks(isArray(path) ? (options = method, path) : [{path: path, method: method, response: response}], objectAssign({}, setupDefaults, options))
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
    getXMLHttpRequest: function (request) {
      return new XEXMLHttpRequest(request)
    },
    sendJSONP: sendJsonpMock,
    sendEndJSONP: sendEndJsonpMock
  })
  if (setupDefaults.log) {
    console.info('[XEAjax] Ready. Detected XEAjaxMock v' + version)
  }
}

function createDefine (method) {
  return function (url, response, options) {
    return XEAjaxMock(url, method, response, options)
  }
}

export function JSONP (url, response, options) {
  return XEAjaxMock(url, 'GET', response, objectAssign({jsonp: 'callback'}, options))
}

export var Mock = XEAjaxMock
export var GET = createDefine('GET')
export var POST = createDefine('POST')
export var PUT = createDefine('PUT')
export var DELETE = createDefine('DELETE')
export var PATCH = createDefine('PATCH')
export var version = '1.4.4'

export default XEAjaxMock
