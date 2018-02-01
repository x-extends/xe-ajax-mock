/*!
 * xe-ajax-mock.js v1.2.4
 * (c) 2017-2018 Xu Liangzhan
 * ISC License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global.XEAjaxMock = factory())
}(this, function () {
  'use strict'

  function isFunction (obj) {
    return typeof obj === 'function'
  }

  function random (min, max) {
    return min >= max ? min : ((min = min || 0) + Math.round(Math.random() * ((max || 9) - min)))
  }

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
        Promise.resolve(isFunction(mock.xhr) ? mock.xhr(request, mock.getResponse(null, 200)) : mock.xhr)
          .then(function (xhr) {
            resolve(mock.getResponse(xhr, 200))
          }).catch(function (xhr) {
            reject(mock.getResponse(xhr, 500))
          })
      }, mock.time)
    })
  }

  function XEMockService (path, method, xhr, options) {
    if (path && method) {
      this.path = path
      this.method = method
      this.time = 0
      this.xhr = xhr
      this.options = options
      this.asyncTimeout = null
    } else {
      throw new TypeError('path and method cannot be empty')
    }
  }

  Object.assign(XEMockService.prototype, {
    getResponse: function (xhr, status) {
      if (xhr && xhr.response !== undefined && xhr.status !== undefined) {
        xhr.headers = Object.assign({}, setupDefaults.headers, xhr.headers)
        return xhr
      }
      return {status: status, response: xhr, headers: Object.assign({}, setupDefaults.headers)}
    },
    send: function (mockXHR, request) {
      var mock = this
      this.time = request.timeout || getTime(this.options.timeout)
      return getXHRResponse(mock, request).then(function (xhr) {
        mock.reply(mockXHR, request, xhr)
      })
    },
    reply: function (mockXHR, request, xhr) {
      if (mockXHR.readyState !== 4) {
        var url = request.getUrl()
        mockXHR.status = xhr.status
        mockXHR.responseText = mockXHR.response = xhr.response ? JSON.stringify(xhr.response) : ''
        mockXHR.responseHeaders = xhr.headers
        mockXHR.readyState = 4
        if (this.options.error && !request.getPromiseStatus(mockXHR)) {
          console.error(request.method + ' ' + url + ' ' + mockXHR.status)
        }
        if (isFunction(mockXHR.onreadystatechange)) {
          mockXHR.onreadystatechange()
        }
        if (this.options.log) {
          console.info('XEMock URL: ' + url + '\nMethod: ' + request.method + ' => Status: ' + (xhr ? xhr.status : 'canceled') + ' => Time: ' + this.time + 'ms')
          console.info(xhr.response)
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
          pathVariable.forEach(function (key, index) {
            item.pathVariable[key] = matchs[index + 1]
          })
        }
        return done
      }
    })
  }

  function defineMocks (list, options, baseURL) {
    if (Array.isArray(list)) {
      list.forEach(function (item) {
        if (item.path) {
          if (!baseURL) {
            baseURL = /\w+:\/{2}.*/.test(item.path) ? '' : options.baseURL
          }
          item.path = (baseURL ? baseURL.replace(/\/$/, '') + '/' : '') + item.path.replace(/^\//, '')
          if (item.xhr) {
            item.method = String(item.method || 'get')
            defineMockServices.push(new XEMockService(item.path, item.method, item.xhr, options))
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

  Object.assign(XEXMLHttpRequest.prototype, {
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
      return getXHRResponse(mock, request).then(function (xhr) {
        var url = request.getUrl()
        if (request.getPromiseStatus(xhr)) {
          global[request.jsonpCallback](xhr.response)
          if (mock.options.log) {
            console.info('XEMock URL: ' + url + '\nMethod: ' + request.method + ' => Status: ' + (xhr ? xhr.status : 'canceled') + ' => Time: ' + mock.time + 'ms')
            console.info(xhr.response)
          }
        } else {
          script.onerror({type: 'error'})
          if (mock.options.error) {
            console.error('JSONP ' + url + ' ' + xhr.status)
          }
        }
      })
    } else {
      document.body.appendChild(script)
    }
  }

  /**
    * XEAjaxMock 虚拟服务
    *
    * @param Array/String path 路径数组/请求路径
    * @param String method 请求方法
    * @param Object/Function xhr 数据或返回数据方法
    * @param Object options 参数
    */
  function XEAjaxMock (path, method, xhr, options) {
    defineMocks(Array.isArray(path) ? (options = method, path) : [{path: path, method: method, xhr: xhr}], Object.assign({}, setupDefaults, options))
    return XEAjaxMock
  }

  /**
   * 设置全局参数
   *
   * @param Object options 参数
   */
  function setup (options) {
    Object.assign(setupDefaults, options)
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
      sendEndJSONP: function () {}
    })
  }

  function createDefine (method) {
    return function (url, xhr, options) {
      return XEAjaxMock(url, method, xhr, options)
    }
  }

  function JSONP (url, xhr, options) {
    return XEAjaxMock(url, 'GET', xhr, Object.assign({jsonp: 'callback'}, options))
  }

  var Mock = XEAjaxMock
  var GET = createDefine('GET')
  var POST = createDefine('POST')
  var PUT = createDefine('PUT')
  var DELETE = createDefine('DELETE')
  var PATCH = createDefine('PATCH')

  /**
   * 混合函数
   *
   * @param {Object} methods 扩展
   */
  function mixin (methods) {
    return Object.assign(XEAjaxMock, methods)
  }

  mixin({
    setup: setup, install: install, JSONP: JSONP, Mock: Mock, GET: GET, POST: POST, PUT: PUT, DELETE: DELETE, PATCH: PATCH
  })
  XEAjaxMock.mixin = mixin

  return XEAjaxMock
}))
