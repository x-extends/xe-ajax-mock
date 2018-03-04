/*!
 * xe-ajax-mock.js v1.5.7
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
        arrayEach([{rules: [['yyyy', 4], ['yyy', 3], ['yy', 2]]},
        {rules: [['MM', 2], ['M', 1]], offset: -1},
        {rules: [['dd', 2], ['d', 1]]},
        {rules: [['HH', 2], ['H', 1]]},
        {rules: [['mm', 2], ['m', 1]]},
        {rules: [['ss', 2], ['s', 1]]},
        {rules: [['SSS', 3], ['SS', 2], ['S', 1]]}], function (item) {
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

  var keyRule = /(.+)\|(array|random)\(([0-9-]+)\)$/

  function XETemplate (tmpl) {
    var result = null
    result = parseValueRule(tmpl, new TemplateOpts())
    if (isObject(result)) {
      var keys = objectKeys(result)
      if (keys.length === 1 && keys[0] === '!return') {
        result = result[keys[0]]
      }
    }
    return result
  }

  function parseValueRule (value, opts) {
    if (value) {
      if (isArray(value)) {
        return parseArray(value, opts)
      }
      if (isObject(value)) {
        return parseObject(value, opts)
      }
      if (isString(value)) {
        return buildTemplate(value, opts)
      }
    }
    return value
  }

  function parseArray (array, opts) {
    var result = []
    arrayEach(array, function (value, index) {
      var options = new TemplateOpts(opts, array, value, index)
      result.push(parseValueRule(value, options))
    })
    return result
  }

  function parseObject (obj, opts) {
    var result = {}
    objectEach(obj, function (value, key) {
      var keyMatch = key.match(keyRule)
      var rest = null
      if (keyMatch && keyMatch.length === 4) {
        key = keyMatch[1]
        var isRandom = keyMatch[2].toLowerCase() === 'random'
        if (keyMatch[2].toLowerCase() === 'array' || isRandom) {
          var len = getScopeNumber(keyMatch[3])
          if (isArray(value)) {
            if (value.length > len) {
              rest = parseArray(isRandom ? arraySample(value, len) : value.slice(0, len))
              if (isRandom && rest.length === 1) {
                rest = rest[0]
              }
            } else {
              rest = value
            }
          } else {
            rest = []
            for (var index = 0; index < len; index++) {
              var op = new TemplateOpts(opts, rest, null, index)
              rest.push(parseValueRule(value, op))
            }
          }
        }
      } else {
        rest = parseValueRule(value, opts)
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

  function TemplateOpts (parent, obj, value, index) {
    this.$parent = parent
    this.$obj = obj
    this.$value = value
    this.$index = index
  }

  function mixinTemplateOpts (methods) {
    return objectAssign(TemplateOpts.prototype, methods)
  }

  var proMethods = {
    random: {
      num: getRandom,
      time: function (startDate, endDate) {
        return getRandom(stringToDate(startDate).getTime(), stringToDate(endDate).getTime())
      },
      date: function (startDate, endDate, format) {
        return dateToString(proMethods.random.time(startDate, endDate), format)
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

  XETemplate.mixin = mixinTemplateOpts
  mixinTemplateOpts(proMethods)

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

  var global = typeof window === 'undefined' ? this : window
  var requireMap = {}
  var defineMockServices = []
  var setupDefaults = {
    baseURL: getBaseURL(),
    template: false,
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

  function XEMockResponse (mock, response, status) {
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
    require: requireJSON
  })

  /**
   * 响应结果
   */
  function getXHRResponse (mock, request) {
    return new Promise(function (resolve, reject) {
      mock.asyncTimeout = setTimeout(function () {
        if (isFunction(mock.response)) {
          return resolve(mock.response(request, new XEMockResponse(mock, null, 200), mock))
        }
        return Promise.resolve(mock.response).then(function (response) {
          resolve(new XEMockResponse(mock, response, 200))
        }).catch(function (response) {
          reject(new XEMockResponse(mock, response, 500))
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
      this.time = request.timeout || getScopeNumber(this.options.timeout)
      return getXHRResponse(mock, request).then(function (response) {
        mock.reply(mockXHR, request, response)
      })
    },
    reply: function (mockXHR, request, response) {
      if (mockXHR.readyState !== 4) {
        var url = request.getUrl()
        if (this.options.template === true) {
          response.body = template(response.body)
        }
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
          console.info(response)
        }
      }
    }
  })

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
          if (item.response) {
            item.method = String(item.method || 'GET')
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
      mock.time = request.timeout || getScopeNumber(mock.options.timeout)
      return getXHRResponse(mock, request).then(function (response) {
        var url = request.getUrl()
        if (request.getPromiseStatus(response)) {
          if (mock.options.template === true) {
            response.body = template(response.body)
          }
          global[request.jsonpCallback](response.body)
          if (mock.options.log) {
            console.info('[XEAjaxMock] URL: ' + url + '\nMethod: ' + request.method + ' => Status: ' + (response ? response.status : 'canceled') + ' => Time: ' + mock.time + 'ms')
            console.info(response)
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
    var opts = objectAssign({}, setupDefaults, options)
    defineMocks(isArray(path) ? (options = method, path) : [{path: path, method: method, response: response}], opts, opts.baseURL, true)
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

  var template = XETemplate
  var Mock = XEAjaxMock
  var GET = createDefine('GET')
  var POST = createDefine('POST')
  var PUT = createDefine('PUT')
  var DELETE = createDefine('DELETE')
  var PATCH = createDefine('PATCH')
  var HEAD = createDefine('HEAD')
  var version = '1.5.7'

  /**
   * 混合函数
   *
   * @param {Object} methods 扩展
   */
  function mixin (methods) {
    return objectAssign(XEAjaxMock, methods)
  }

  mixin({
    setup: setup, install: install, template: template, Mock: Mock, JSONP: JSONP, GET: GET, POST: POST, PUT: PUT, DELETE: DELETE, PATCH: PATCH, HEAD: HEAD, version: version
  })
  XEAjaxMock.mixin = mixin

  return XEAjaxMock
}))
