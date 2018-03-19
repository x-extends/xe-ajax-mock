/**
 * xe-ajax-mock.js v1.6.10
 * (c) 2017-2018 Xu Liangzhan
 * ISC License.
 * @preserve
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory()
    : typeof define === 'function' && define.amd ? define(factory)
      : (global.XEAjaxMock = factory())
}(this, function () {
  'use strict'

  var isArray = Array.isArray || function (obj) {
    return obj ? obj.constructor === Array : false
  }

  function isDate (val) {
    return val ? val.constructor === Date : false
  }

  function isObject (val) {
    return typeof val === 'object'
  }

  function isFunction (obj) {
    return typeof obj === 'function'
  }

  function isString (val) {
    return typeof val === 'string'
  }

  function getRandom (min, max) {
    return min >= max ? min : ((min = min || 0) + Math.round(Math.random() * ((max || 9) - min)))
  }

  var dateFormatRules = [
    { rules: [['yyyy', 4], ['yyy', 3], ['yy', 2]] },
    { rules: [['MM', 2], ['M', 1]], offset: -1 },
    { rules: [['dd', 2], ['d', 1]] },
    { rules: [['HH', 2], ['H', 1]] },
    { rules: [['mm', 2], ['m', 1]] },
    { rules: [['ss', 2], ['s', 1]] },
    { rules: [['SSS', 3], ['SS', 2], ['S', 1]] }
  ]

  function stringToDate (str, format) {
    if (str) {
      if (isDate(str)) {
        return str
      }
      if (!isNaN(str)) {
        return new Date(str)
      }
      if (isString(str)) {
        format = format || 'yyyy-MM-dd HH:mm:ss.SSS'
        var dates = []
        arrayEach(dateFormatRules, function (item) {
          for (var arr, sIndex, index = 0, rules = item.rules, len = rules.length; index < len; index++) {
            arr = rules[index]
            sIndex = format.indexOf(arr[0])
            if (sIndex > -1) {
              dates.push(parseFloat(str.substring(sIndex, sIndex + arr[1]) || 0) + (item.offset || 0))
              break
            } else if (index === len - 1) {
              dates.push(0)
            }
          }
        })
        return new Date(dates[0], dates[1], dates[2], dates[3], dates[4], dates[5], dates[6])
      }
    }
    return 'Invalid Date'
  }

  function dateToString (date, format) {
    date = stringToDate(date)
    if (isDate(date)) {
      var result = format || 'yyyy-MM-dd HH:mm:ss'
      var weeks = ['日', '一', '二', '三', '四', '五', '六']
      var resDate = {
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'M+': date.getMonth() + 1,
        'E+': date.getDay(),
        'd+': date.getDate(),
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'S': date.getMilliseconds()
      }
      if (/(y+)/.test(result)) {
        result = result.replace(RegExp.$1, ('' + date.getFullYear()).substr(4 - RegExp.$1.length))
      }
      arrayEach(objectKeys(resDate), function (key) {
        if (new RegExp('(' + key + ')').test(result)) {
          var val = '' + resDate[key]
          result = result.replace(RegExp.$1, (key === 'q+' || key === 'E+') ? weeks[val] : (RegExp.$1.length === 1 ? val : ('00' + val).substr(val.length)))
        }
      })
      return result
    }
    return date
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

  function objectEach (obj, iteratee, context) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        iteratee.call(context || this, obj[key], key, obj)
      }
    }
  }

  function objectKeys (obj) {
    var result = []
    if (obj) {
      if (Object.keys) {
        return Object.keys(obj)
      }
      objectEach(obj, function (val, key) {
        result.push(key)
      })
    }
    return result
  }

  function objectValues (obj) {
    if (Object.values) {
      return obj ? Object.values(obj) : []
    }
    var result = []
    arrayEach(objectKeys(obj), function (key) {
      result.push(obj[key])
    })
    return result
  }

  function arrayShuffle (array) {
    var result = []
    for (var list = objectValues(array), len = list.length - 1; len >= 0; len--) {
      var index = len > 0 ? getRandom(0, len) : 0
      result.push(list[index])
      list.splice(index, 1)
    }
    return result
  }

  function arraySample (array, number) {
    var result = arrayShuffle(array)
    if (arguments.length === 1) {
      return result[0]
    }
    if (number < result.length) {
      result.length = number || 0
    }
    return result
  }

  function getLocatOrigin () {
    return location.origin || (location.protocol + '//' + location.host)
  }

  function getBaseURL () {
    var pathname = location.pathname
    var lastIndex = lastIndexOf(pathname, '/') + 1
    return getLocatOrigin() + (lastIndex === pathname.length ? pathname : pathname.substring(0, lastIndex))
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

  function getScopeNumber (str) {
    var matchs = String(str).match(/(\d+)-(\d+)/)
    return matchs && matchs.length === 3 ? getRandom(parseInt(matchs[1]), parseInt(matchs[2])) : (isNaN(str) ? 0 : Number(str))
  }

  var tmplMethods = {
    random: {
      num: getRandom,
      time: function (startDate, endDate, format) {
        if (startDate) {
          if (!endDate) {
            return stringToDate(startDate, format).getTime()
          }
          return getRandom(stringToDate(startDate, format).getTime(), stringToDate(endDate, format).getTime())
        }
        return startDate
      },
      date: function (startDate, endDate, format) {
        if (startDate) {
          if (!endDate) {
            return dateToString(startDate, format)
          }
          return dateToString(tmplMethods.random.time(startDate, endDate), format)
        }
        return startDate
      },
      repeat: function (array, min, max) {
        min = min || 1
        max = max || min
        if (isString(array)) {
          array = array.split('')
        }
        if (array.length < max) {
          var result = array
          while (result.length < max) {
            result = result.concat(array)
          }
          result.length = max
          array = result
        }
        return arraySample(array, getRandom(min, max)).join('')
      }
    }
  }

  var tmplJoint = {
    tStart: '__restArr=[]',
    tEnd: "return __restArr.join('');",
    contStart: "__restArr.push('",
    contEnd: "');\n",
    contTrimEnd: "'.trim());\n",
    cStart: '__restArr.push(',
    cEnd: ');\n',
    simplifyRegExp: /__restArr\.push\('\s*'\);/g
  }

  function buildCode (code) {
    return tmplJoint.contEnd + code + tmplJoint.contStart
  }

  function buildTemplate (strTmpl, data) {
    var restTmpl = strTmpl
      .replace(/[\r\n\t]/g, ' ')
      .replace(/{{\s*(.*?)\s*}}/g, function (matching, code) {
        return buildCode(tmplJoint.cStart + code + tmplJoint.cEnd)
      })
    try {
      restTmpl = 'var ' + tmplJoint.tStart + ';with(opts){' + tmplJoint.contStart + restTmpl + tmplJoint.contEnd + '};' + tmplJoint.tEnd
      /* eslint-disable no-new-func */
      return new Function('opts', restTmpl.replace(tmplJoint.simplifyRegExp, ''))(data)
    } catch (e) {
      console.error(e)
    }
    return strTmpl
  }

  var keyRule = /(.+)\|(array|random)\((.+)\)$/

  function XETemplate (tmpl, fns) {
    var result = null
    result = parseValueRule(tmpl, new TemplateMethods({}, fns))
    if (isObject(result)) {
      var keys = objectKeys(result)
      if (keys.length === 1 && keys[0] === '!return') {
        result = result[keys[0]]
      }
    }
    return result
  }

  function parseValueRule (value, tmplMethods) {
    if (value) {
      if (isArray(value)) {
        return parseArray(value, tmplMethods)
      }
      if (isObject(value)) {
        return parseObject(value, tmplMethods)
      }
      if (isString(value)) {
        return buildTemplate(value, tmplMethods)
      }
    }
    return value
  }

  function parseArray (array, tmplMethods) {
    var result = []
    arrayEach(array, function (value, index) {
      var options = new TemplateMethods({ $parent: tmplMethods, $obj: array, $value: value, $size: array.length, $index: index }, tmplMethods.$fns)
      result.push(parseValueRule(value, options))
    })
    return result
  }

  function parseObject (obj, tmplMethods) {
    var result = {}
    objectEach(obj, function (value, key) {
      var keyMatch = key.match(keyRule)
      var rest = null
      if (keyMatch && keyMatch.length === 4) {
        key = keyMatch[1]
        var isRandom = keyMatch[2].toLowerCase() === 'random'
        if (keyMatch[2].toLowerCase() === 'array' || isRandom) {
          var len = getScopeNumber(buildTemplate(keyMatch[3], tmplMethods))
          if (isArray(value)) {
            if (value.length > len) {
              rest = parseArray(isRandom ? arraySample(value, len) : value.slice(0, len), tmplMethods)
              if (isRandom && rest.length === 1) {
                rest = rest[0]
              }
            } else {
              rest = parseArray(value, tmplMethods)
            }
          } else {
            rest = []
            for (var index = 0; index < len; index++) {
              var op = new TemplateMethods({ $parent: tmplMethods, $obj: rest, $value: null, $size: len, $index: index }, tmplMethods.$fns)
              rest.push(parseValueRule(value, op))
            }
          }
        }
      } else {
        rest = parseValueRule(value, tmplMethods)
        keyMatch = key.match(/(.+)\|(number|boolean)$/)
        if (keyMatch && keyMatch.length === 3) {
          key = keyMatch[1]
          if (keyMatch[2].toLowerCase() === 'number') {
            rest = parseFloat(rest)
          } else if (keyMatch[2].toLowerCase() === 'boolean') {
            rest = rest === '0' ? false : Boolean(rest)
          }
        }
      }
      result[key] = rest
    })
    return result
  }

  function TemplateMethods (methods, fns) {
    this.$fns = fns
    objectAssign(this, fns, methods)
  }

  function mixinTemplateMethods (methods) {
    return objectAssign(TemplateMethods.prototype, methods)
  }

  XETemplate.mixin = mixinTemplateMethods
  mixinTemplateMethods(tmplMethods)

  function xefetch (url, options) {
    var request = options._request
    var mockItem = mateMockItem(request)
    if (mockItem) {
      mockItem.time = getScopeNumber(mockItem.options.timeout)
      return mockItem.getMockResponse(request).then(function (response) {
        mockItem.outMockLog(request, response)
        return response
      })
    } else {
      return fetch(url, options)
    }
  }

  function XEXMLHttpRequest () {
    this._mock = null
    this._xhr = null
  }

  objectAssign(XEXMLHttpRequest.prototype, {
    timeout: 0,
    status: 0,
    readyState: 0,
    ontimeout: null,
    onreadystatechange: null,
    withCredentials: false,
    response: '',
    responseText: '',
    open: function (method, url) {
      this._mock = mateMockItem(this._request)
      if (this._mock) {
        this.readyState = 1
        if (isFunction(this.onreadystatechange)) {
          this.onreadystatechange()
        }
      } else {
        this._xhr = new XMLHttpRequest()
        this._xhr.open(method, url, true)
      }
    },
    send: function (body) {
      var mockXHR = this
      var mockItem = this._mock
      var request = this._request
      if (mockItem) {
        mockItem.time = getScopeNumber(mockItem.options.timeout)
        return mockItem.getMockResponse(request).then(function (response) {
          mockXHR.readyState = 4
          mockXHR._updateResponse(request, response)
          mockXHR._triggerEvent('readystatechange')
          mockXHR._triggerEvent('load')
          mockItem.outMockLog(request, response)
        })
      } else {
        var xhr = this._xhr
        xhr.withCredentials = this.withCredentials
        xhr.responseType = this.responseType || ''
        xhr.onload = function () {
          mockXHR._triggerEvent('load')
        }
        xhr.onerror = function () {
          mockXHR._triggerEvent('error')
        }
        xhr.onreadystatechange = function () {
          mockXHR.readyState = xhr.readyState
          mockXHR._updateResponse(request, { status: xhr.status, body: xhr.response })
          mockXHR._triggerEvent('readystatechange')
        }
        xhr.send(body)
      }
    },
    abort: function () {
      var mockXHR = this
      var mockItem = this._mock
      var request = this._request
      setTimeout(function () {
        if (mockItem) {
          if (mockXHR.readyState !== 0) {
            clearTimeout(mockItem.asyncTimeout)
            var response = { status: 0, body: '' }
            mockXHR._updateResponse(mockXHR._request, response)
            mockXHR.readyState = 4
            mockXHR._triggerEvent('timeout')
            mockXHR.readyState = 0
            mockItem.outMockLog(request, response)
          }
        } else if (mockXHR._xhr) {
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
      var responseHeader = this._headers
      if (responseHeader) {
        for (var key in responseHeader) {
          if (responseHeader.hasOwnProperty(key)) {
            result += key + ': ' + responseHeader[key] + '\n'
          }
        }
      }
      return result
    },
    _triggerEvent: function (name) {
      if (isFunction(this['on' + name])) {
        this['on' + name]({ type: name })
      }
    },
    _updateResponse: function (request, response) {
      var body = response.body
      this.status = response.status
      this._headers = response.headers
      if (this._mock) {
        body = response.body && !isString(response.body) ? JSON.stringify(response.body) : ''
      }
      if (this.responseType === 'blob') {
        this.response = body instanceof Blob ? body : new Blob([body])
        this.responseText = ''
      } else {
        this.responseText = this.response = body
      }
    }
  })

  var $global = typeof window === 'undefined' ? this : window

  function jsonpClear (request) {
    if (request.script.parentNode === document.body) {
      document.body.removeChild(request.script)
    }
    try {
      delete $global[request.jsonpCallback]
    } catch (e) {
      // IE8
      $global[request.jsonpCallback] = undefined
    }
  }

  function jsonpSuccess (request, response, resolve) {
    jsonpClear(request)
    resolve(response)
  }

  function jsonpError (request, reject) {
    jsonpClear(request)
    reject(new TypeError('JSONP request failed'))
  }

  /**
   * jsonp
   */
  function xejsonp (script, request) {
    return new Promise(function (resolve, reject) {
      var mockItem = mateMockItem(request)
      $global[request.jsonpCallback] = function (body) {
        jsonpSuccess(request, { status: 200, body: body }, resolve)
      }
      if (mockItem) {
        mockItem.time = getScopeNumber(mockItem.options.timeout)
        return mockItem.getMockResponse(mockItem, request).then(function (response) {
          if (response.status < 200 || response.status >= 300) {
            jsonpError(request, reject)
          } else {
            jsonpSuccess(request, response.body, resolve)
          }
          mockItem.outMockLog(request, response)
        })
      } else {
        var url = request.getUrl()
        script.type = 'text/javascript'
        script.src = url + (url.indexOf('?') === -1 ? '?' : '&') + request.jsonp + '=' + request.jsonpCallback
        script.onerror = function () {
          jsonpError(request, reject)
        }
        if (request.timeout) {
          setTimeout(function () {
            jsonpError(request, reject)
          }, request.timeout)
        }
        document.body.appendChild(script)
      }
    })
  }

  var requireMap = {}

  function parseRequire (response, path) {
    try {
      return JSON.parse(requireMap[path])
    } catch (e) { }
    return requireMap[path]
  }

  function requireJSON (path) {
    var response = this
    return new Promise(function (resolve, reject) {
      if (path.indexOf('/') === 0) {
        path = getLocatOrigin() + path
      } else if (!/\w+:\/{2}.*/.test(path)) {
        path = setupDefaults.baseURL.replace(/\/$/, '') + '/' + path
      }
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

  function XEMockResponse (mockItem, request, response, status) {
    if (response && mockItem.options.template === true) {
      response = template(response, { $pathVariable: mockItem.pathVariable, $params: request.params || {}, $body: request.body || {} })
    }
    if (response && response.body !== undefined && response.status !== undefined) {
      response.headers = objectAssign({}, mockItem.options.headers, response.headers)
      objectAssign(this, response)
    } else {
      this.status = status
      this.body = response
      this.headers = objectAssign({}, mockItem.options.headers)
    }
  }

  objectAssign(XEMockResponse.prototype, {
    require: requireJSON
  })

  var defineMockServices = []

  var setupDefaults = {
    baseURL: getBaseURL(),
    template: false,
    pathVariable: true,
    timeout: '20-400',
    headers: null,
    error: true,
    log: false
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
  function XEAjaxMock (path, method, response, options) {
    var opts = objectAssign({}, setupDefaults, options)
    defineMocks(isArray(path) ? (options = method, path) : [{ path: path, method: method, response: response }], opts, opts.baseURL, true)
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

  function mateMockItem (request) {
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

  function XEMock (path, method, response, options) {
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

  function createDefine (method) {
    return function (url, response, options) {
      return Mock(url, method, response, options)
    }
  }

  function JSONP (url, response, options) {
    return Mock(url, 'GET', response, objectAssign({ jsonp: 'callback' }, options))
  }

  var template = XETemplate
  var Mock = XEAjaxMock
  var GET = createDefine('GET')
  var POST = createDefine('POST')
  var PUT = createDefine('PUT')
  var DELETE = createDefine('DELETE')
  var PATCH = createDefine('PATCH')
  var HEAD = createDefine('HEAD')

  var exportMethods = {
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

  /**
   * 混合函数
   *
   * @param {Object} methods 扩展
   */
  function mixin (methods) {
    return objectAssign(XEAjaxMock, methods)
  }

  objectAssign(XEAjaxMock, {
    mixin: mixin,
    setup: setup,
    install: install,
    version: '1.6.10',
    $name: 'XEAjaxMock'
  })

  mixin(exportMethods)

  return XEAjaxMock
}))
