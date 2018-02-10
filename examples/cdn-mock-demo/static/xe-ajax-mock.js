/*!
 * xe-ajax-mock.js v1.4.8
 * (c) 2017-2018 Xu Liangzhan
 * ISC License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global.XEAjaxMock = factory())
}(this, function () {
  'use strict'

  var isArray = Array.isArray || function (obj) {
    return obj ? obj.constructor === Array : false
  }

  function isFunction (obj) {
    return typeof obj === 'function'
  }

  function random (min, max) {
    return min >= max ? min : ((min = min || 0) + Math.round(Math.random() * ((max || 9) - min)))
  }

  var objectAssign = Object.assign || function (target) {
    for (var source, index = 1, len = arguments.length; index < len; index++) {
      source = arguments[index]
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

  function arrayEach (array, callback, context) {
    if (array.forEach) {
      return array.forEach(callback, context)
    }
    for (var index = 0, len = array.length || 0; index < len; index++) {
      callback.call(context || global, array[index], index, array)
    }
  }

  function getBaseURL () {
    var pathname = location.pathname
    var lastIndex = lastIndexOf(pathname, '/') + 1
    return location.origin + (lastIndex === pathname.length ? pathname : pathname.substring(0, lastIndex))
  }

  function lastIndexOf (str, val) {
    if (isFunction(str.lastIndexOf)) {
      return str.lastIndexOf(val)
    } else {
      for (var len = str.length - 1; len >= 0; len--) {
        if (val === str[len]) {
          return len
        };
      }
    }
    return -1
  }

  var global = typeof window === 'undefined' ? this : window
  var requireMap = {}
  var defineMockServices = []
  var setupDefaults = {
    baseURL: getBaseURL(),
    timeout: '20-400',
    headers: null,
    error: true,
    log: true
  }

  function parseRequire (response, path) {
    response.body = null
    try {
      response.body = JSON.parse(requireMap[path])
    } catch (e) {
      response.body = requireMap[path]
    }
    return response
  }

  function require (path) {
    var response = this
    return new Promise(function (resolve, reject) {
      if (requireMap[path]) {
        resolve(parseRequire(response, path))
      } else {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', path, true)
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status < 200 && xhr.status >= 300) {
              if (setupDefaults.error) {
                console.error('This relative module was not found: ' + path)
              }
            }
            requireMap[path] = xhr.responseText
            resolve(parseRequire(response, path))
          }
        }
        xhr.send()
      }
    })
  }

  function XEMockResponse (response, status) {
    if (response && response.body !== undefined && response.status !== undefined) {
      response.headers = objectAssign({}, setupDefaults.headers, response.headers)
      objectAssign(this, response)
    } else {
      this.status = status
      this.body = response
      this.headers = objectAssign({}, setupDefaults.headers)
    }
  }

  objectAssign(XEMockResponse.prototype, {
    require: require
  })

  /**
   * 响应结果
   */
  function getXHRResponse (mock, request) {
    return new Promise(function (resolve, reject) {
      mock.asyncTimeout = setTimeout(function () {
        if (isFunction(mock.response)) {
          return resolve(mock.response(request, new XEMockResponse(null, 200), mock))
        }
        return Promise.resolve(mock.response).then(function (response) {
          resolve(new XEMockResponse(response, 200))
        })['catch'](function (response) {
          reject(new XEMockResponse(response, 500))
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
    this._mock = null
    this._xhr = null
    this._request = request
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
      this._mock = mateMockItem(this._request)
      if (this._mock) {
        this.readyState = 1
        if (isFunction(this.onreadystatechange)) {
          this.onreadystatechange()
        }
      } else {
        this._xhr = new XMLHttpRequest()
        this._xhr.open(method, url, async)
      }
    },
    send: function (body) {
      if (this._mock) {
        this._mock.send(this, this._request)
      } else {
        var xhr = this._xhr
        var mockXHR = this
        if (this.ontimeout) {
          xhr.ontimeout = this.ontimeout
        }
        xhr.withCredentials = this.withCredentials
        xhr.onreadystatechange = function () {
          mockXHR.status = xhr.status
          mockXHR.readyState = xhr.readyState
          mockXHR.response = xhr.response
          mockXHR.responseText = xhr.responseText
          xhr.getAllResponseHeaders().trim()
          if (isFunction(mockXHR.onreadystatechange)) {
            mockXHR.onreadystatechange()
          }
        }
        xhr.send(body)
      }
    },
    abort: function (response) {
      var mockXHR = this
      setTimeout(function () {
        if (mockXHR._mock) {
          if (mockXHR.readyState !== 0) {
            clearTimeout(mockXHR._mock.asyncTimeout)
            mockXHR._mock.reply(mockXHR, mockXHR._request, response || {status: 0, response: ''})
            mockXHR.readyState = 0
          }
        } else {
          mockXHR._xhr.abort()
        }
      })
    },
    setRequestHeader: function (name, value) {
      if (this._xhr) {
        this._xhr.setRequestHeader(name, value)
      }
    },
    getAllResponseHeaders: function () {
      if (this._xhr) {
        return this._xhr.getAllResponseHeaders()
      }
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
  function setup (options) {
    objectAssign(setupDefaults, options)
  }

  /**
   * 初始化安装
   */
  function install (XEAjax) {
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

  function JSONP (url, response, options) {
    return XEAjaxMock(url, 'GET', response, objectAssign({jsonp: 'callback'}, options))
  }

  var Mock = XEAjaxMock
  var GET = createDefine('GET')
  var POST = createDefine('POST')
  var PUT = createDefine('PUT')
  var DELETE = createDefine('DELETE')
  var PATCH = createDefine('PATCH')
  var version = '1.4.8'

  /**
   * 混合函数
   *
   * @param {Object} methods 扩展
   */
  function mixin (methods) {
    return objectAssign(XEAjaxMock, methods)
  }

  mixin({
    setup: setup, install: install, JSONP: JSONP, Mock: Mock, GET: GET, POST: POST, PUT: PUT, DELETE: DELETE, PATCH: PATCH, version: version
  })
  XEAjaxMock.mixin = mixin

  return XEAjaxMock
}))
