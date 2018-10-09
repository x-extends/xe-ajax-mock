/**
 * xe-ajax-mock.js v1.7.2
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

  var objectToString = Object.prototype.toString

  var dateFormatRules = [
    { rules: [['yyyy', 4], ['yyy', 3], ['yy', 2]] },
    { rules: [['MM', 2], ['M', 1]], offset: -1 },
    { rules: [['dd', 2], ['d', 1]] },
    { rules: [['HH', 2], ['H', 1]] },
    { rules: [['mm', 2], ['m', 1]] },
    { rules: [['ss', 2], ['s', 1]] },
    { rules: [['SSS', 3], ['SS', 2], ['S', 1]] }
  ]

  var utils = {

    isArray: Array.isArray || function (val) {
      return objectToString.call(val) === '[object Array]'
    },

    isDate: function (val) {
      return objectToString.call(val) === '[object Date]'
    },

    isObject: function (val) {
      return typeof val === 'object'
    },

    isFunction: function (obj) {
      return typeof obj === 'function'
    },

    isString: function (val) {
      return typeof val === 'string'
    },

    getRandom: function (min, max) {
      return min >= max ? min : ((min = min || 0) + Math.round(Math.random() * ((max || 9) - min)))
    },

    stringToDate: function (str, format) {
      if (str) {
        if (utils.isDate(str)) {
          return str
        }
        if (!isNaN(str)) {
          return new Date(str)
        }
        if (utils.isString(str)) {
          format = format || 'yyyy-MM-dd HH:mm:ss.SSS'
          var dates = []
          utils.arrayEach(dateFormatRules, function (item) {
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
    },

    dateToString: function (date, format) {
      date = utils.stringToDate(date)
      if (utils.isDate(date)) {
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
        var result = String(format || 'yyyy-MM-dd HH:mm:ss').replace(/(y+)/, function ($1) {
          return ('' + date.getFullYear()).substr(4 - $1.length)
        })
        for (var key in resDate) {
          if (resDate.hasOwnProperty(key)) {
            var val = '' + resDate[key]
            result = result.replace(new RegExp('(' + key + ')'), function ($1) {
              return (key === 'q+' || key === 'E+') ? weeks[val] : ($1.length === 1 ? val : ('00' + val).substr(val.length))
            })
          }
        }
        return result
      }
      return date
    },

    objectAssign: Object.assign || function (target) {
      for (var source, index = 1, len = arguments.length; index < len; index++) {
        source = arguments[index]
        for (var key in source) {
          if (source.hasOwnProperty(key)) {
            target[key] = source[key]
          }
        }
      }
      return target
    },

    arrayEach: function (array, callback, context) {
      if (array.forEach) {
        return array.forEach(callback, context)
      }
      for (var index = 0, len = array.length || 0; index < len; index++) {
        callback.call(context || global, array[index], index, array)
      }
    },

    objectEach: function (obj, iteratee, context) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          iteratee.call(context || this, obj[key], key, obj)
        }
      }
    },

    objectKeys: function (obj) {
      var result = []
      if (obj) {
        if (Object.keys) {
          return Object.keys(obj)
        }
        utils.objectEach(obj, function (val, key) {
          result.push(key)
        })
      }
      return result
    },

    objectValues: function (obj) {
      if (Object.values) {
        return obj ? Object.values(obj) : []
      }
      var result = []
      utils.arrayEach(utils.objectKeys(obj), function (key) {
        result.push(obj[key])
      })
      return result
    },

    arrayShuffle: function (array) {
      var result = []
      for (var list = utils.objectValues(array), len = list.length - 1; len >= 0; len--) {
        var index = len > 0 ? utils.getRandom(0, len) : 0
        result.push(list[index])
        list.splice(index, 1)
      }
      return result
    },

    arraySample: function (array, number) {
      var result = utils.arrayShuffle(array)
      if (arguments.length === 1) {
        return result[0]
      }
      if (number < result.length) {
        result.length = number || 0
      }
      return result
    },

    getLocatOrigin: function () {
      return typeof location === 'undefined' ? '' : (location.origin || (location.protocol + '//' + location.host))
    },

    getBaseURL: function () {
      if (typeof location === 'undefined') {
        return ''
      }
      var pathname = location.pathname
      var lastIndex = utils.lastIndexOf(pathname, '/') + 1
      return utils.getLocatOrigin() + (lastIndex === pathname.length ? pathname : pathname.substring(0, lastIndex))
    },

    lastIndexOf: function (str, val) {
      if (utils.isFunction(str.lastIndexOf)) {
        return str.lastIndexOf(val)
      } else {
        for (var len = str.length - 1; len >= 0; len--) {
          if (val === str[len]) {
            return len
          };
        }
      }
      return -1
    },

    getScopeNumber: function (str) {
      var matchs = String(str).match(/(\d+)-(\d+)/)
      return matchs && matchs.length === 3 ? utils.getRandom(parseInt(matchs[1]), parseInt(matchs[2])) : (isNaN(str) ? 0 : Number(str))
    }
  }

  var setupDefaults = {
    baseURL: utils.getBaseURL(),
    template: false,
    pathVariable: true,
    timeout: '20-400',
    headers: null,
    error: true,
    log: false
  }

  var mockStore = []

  var tmplMixinExports = {
    random: {
      num: utils.getRandom,
      time: function (startDate, endDate, format) {
        if (startDate) {
          if (!endDate) {
            return utils.stringToDate(startDate, format).getTime()
          }
          return utils.getRandom(utils.stringToDate(startDate, format).getTime(), utils.stringToDate(endDate, format).getTime())
        }
        return startDate
      },
      date: function (startDate, endDate, format) {
        if (startDate) {
          if (!endDate) {
            return utils.dateToString(startDate, format)
          }
          return utils.dateToString(tmplMixinExports.random.time(startDate, endDate), format)
        }
        return startDate
      },
      repeat: function (array, min, max) {
        min = min || 1
        max = max || min
        if (utils.isString(array)) {
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
        return utils.arraySample(array, utils.getRandom(min, max)).join('')
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
    if (utils.isObject(result)) {
      var keys = utils.objectKeys(result)
      if (keys.length === 1 && (keys[0] === '!return' || keys[0] === '~')) {
        result = result[keys[0]]
      }
    }
    return result
  }

  function parseValueRule (value, methods) {
    if (value) {
      if (utils.isArray(value)) {
        return parseArray(value, methods)
      }
      if (utils.isObject(value)) {
        return parseObject(value, methods)
      }
      if (utils.isString(value)) {
        return buildTemplate(value, methods)
      }
    }
    return value
  }

  function parseArray (array, methods) {
    var result = []
    utils.arrayEach(array, function (value, index) {
      var options = new TemplateMethods({ $parent: methods, $obj: array, $value: value, $size: array.length, $index: index }, methods.$fns)
      result.push(parseValueRule(value, options))
    })
    return result
  }

  function parseObject (obj, methods) {
    var result = {}
    utils.objectEach(obj, function (value, key) {
      var keyMatch = key.match(keyRule)
      var rest = null
      if (keyMatch && keyMatch.length === 4) {
        key = keyMatch[1]
        var isRandom = keyMatch[2].toLowerCase() === 'random'
        if (keyMatch[2].toLowerCase() === 'array' || isRandom) {
          var len = utils.getScopeNumber(buildTemplate(keyMatch[3], methods))
          if (utils.isArray(value)) {
            if (value.length > len) {
              rest = parseArray(isRandom ? utils.arraySample(value, len) : value.slice(0, len), methods)
              if (isRandom && rest.length === 1) {
                rest = rest[0]
              }
            } else {
              rest = parseArray(value, methods)
            }
          } else {
            rest = []
            for (var index = 0; index < len; index++) {
              var op = new TemplateMethods({ $parent: methods, $obj: rest, $value: null, $size: len, $index: index }, methods.$fns)
              rest.push(parseValueRule(value, op))
            }
          }
        }
      } else {
        rest = parseValueRule(value, methods)
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
    utils.objectAssign(this, fns, methods)
  }

  XETemplate.mixin = function (methods) {
    return utils.objectAssign(TemplateMethods.prototype, methods)
  }

  XETemplate.mixin(tmplMixinExports)

  function XEXMLHttpRequest () {
    this._mock = null
    this._xhr = null
  }

  utils.objectAssign(XEXMLHttpRequest.prototype, {
    timeout: 0,
    status: 0,
    readyState: 0,
    ontimeout: null,
    onreadystatechange: null,
    withCredentials: false,
    response: '',
    responseText: '',
    open: function (method, url) {
      this._mock = handleExports.mateMockItem(this._request)
      if (this._mock) {
        this.readyState = 1
        if (utils.isFunction(this.onreadystatechange)) {
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
        mockItem.time = utils.getScopeNumber(mockItem.options.timeout)
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
        xhr.ontimeout = function () {
          mockXHR._triggerEvent('timeout')
        }
        xhr.onabort = function () {
          mockXHR._triggerEvent('abort')
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
      if (utils.isFunction(this['on' + name])) {
        this['on' + name]({ type: name })
      }
    },
    _updateResponse: function (request, response) {
      var body = response.body || ''
      this.status = response.status
      this._headers = response.headers
      if (this._mock) {
        if (!utils.isString(body)) {
          body = JSON.stringify(body)
        }
      }
      if (this.responseType === 'blob') {
        this.response = body instanceof Blob ? body : new Blob([body])
        this.responseText = ''
      } else {
        this.responseText = this.response = body
      }
    }
  })

  var xhrExports = {
    XEXMLHttpRequest: XEXMLHttpRequest
  }

  function sendFetch (url, options) {
    var request = options._request
    var mockItem = handleExports.mateMockItem(request)
    if (mockItem) {
      mockItem.time = utils.getScopeNumber(mockItem.options.timeout)
      return mockItem.getMockResponse(request).then(function (response) {
        mockItem.outMockLog(request, response)
        return response
      })
    } else {
      return self.fetch(url, options)
    }
  }

  var fetchExports = {
    sendJsonp: sendFetch
  }

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
  function sendJsonp (script, request) {
    return new Promise(function (resolve, reject) {
      var mockItem = handleExports.mateMockItem(request)
      $global[request.jsonpCallback] = function (body) {
        jsonpSuccess(request, { status: 200, body: body }, resolve)
      }
      if (mockItem) {
        mockItem.time = utils.getScopeNumber(mockItem.options.timeout)
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

  var jsonpExports = {
    sendJsonp: sendJsonp
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
        path = utils.getLocatOrigin() + path
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
      response = XETemplate(response, { $pathVariable: mockItem.pathVariable, $params: request.params || {}, $body: request.body || {} })
    }
    if (response && response.body !== undefined && response.status !== undefined) {
      response.headers = utils.objectAssign({}, mockItem.options.headers, response.headers)
      utils.objectAssign(this, response)
    } else {
      this.status = status
      this.body = response
      this.headers = utils.objectAssign({}, mockItem.options.headers)
    }
  }

  utils.objectAssign(XEMockResponse.prototype, {
    require: requireJSON
  })

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

  var handleExports = {
    mateMockItem: function (request) {
      var url = (request.getUrl() || '').split(/\?|#/)[0]
      return mockStore.find(function (mockItem) {
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
            utils.arrayEach(pathVariable, function (key, index) {
              mockItem.pathVariable[key] = parsePathVariable(matchs[index + 1], mockItem)
            })
          }
          return done
        }
      })
    }
  }

  /**
    * XEAjaxMock
    *
    * @param { Array/String } path 请求路径
    * @param { String } method 请求方法
    * @param { Object/Function } response 响应处理 (request, response, context), format: {status: 200, statusText: 'OK', body: {}, headers: {}}
    * @param { Object } options 局部参数
    */
  function XEAjaxMock (path, method, response, options) {
    var opts = utils.objectAssign({}, setupDefaults, options)
    defineMocks(utils.isArray(path) ? (options = method, path) : [{ path: path, method: method, response: response }], opts, opts.baseURL, true)
    return XEAjaxMock
  }

  XEAjaxMock.version = '1.7.2'

  /**
   * setup defaults
   *
   * @param Object options
   */
  XEAjaxMock.setup = function (options) {
    utils.objectAssign(setupDefaults, options)
  }

  /**
   * install
   */
  XEAjaxMock.install = function (XEAjax) {
    XEAjax.setup({

      $fetch: fetchExports.sendJsonp,
      $XMLHttpRequest: xhrExports.XEXMLHttpRequest,
      $jsonp: jsonpExports.sendJsonp
    })
  }

  /**
   * 混合函数
   *
   * @param {Object} methods 扩展
   */
  XEAjaxMock.mixin = function (methods) {
    return utils.objectAssign(XEAjaxMock, methods)
  }

  function defineMocks (list, options, baseURL, first) {
    if (utils.isArray(list)) {
      utils.arrayEach(list, function (item) {
        if (item.path) {
          if (first && item.path.indexOf('/') === 0) {
            item.path = utils.getLocatOrigin() + item.path
          } else if (first && /\w+:\/{2}.*/.test(item.path)) {
            item.path = item.path
          } else {
            item.path = baseURL.replace(/\/$/, '') + '/' + item.path.replace(/^\//, '')
          }
          if (item.response !== undefined) {
            item.method = String(item.method || 'GET')
            mockStore.push(new XEMock(item.path, item.method, item.response, options))
          }
          defineMocks(item.children, options, item.path)
        }
      })
    }
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
            if (utils.isFunction(mockItem.response)) {
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
      return XEAjaxMock(url, method, response, options)
    }
  }

  function JSONP (url, response, options) {
    return XEAjaxMock(url, 'GET', response, utils.objectAssign({ jsonp: 'callback' }, options))
  }

  var ajaxMockExports = {
    template: XETemplate,
    Mock: XEAjaxMock,
    JSONP: JSONP,
    GET: createDefine('GET'),
    POST: createDefine('POST'),
    PUT: createDefine('PUT'),
    DELETE: createDefine('DELETE'),
    PATCH: createDefine('PATCH'),
    HEAD: createDefine('HEAD')
  }

  XEAjaxMock.mixin(ajaxMockExports)

  return XEAjaxMock
}))
