import { isFunction, getScopeNumber, objectAssign } from '../core/util'
import { mateMockItem } from '../core/mock'
import { XETemplate } from '../template'
import { getXHRResponse } from '../core/response'

export function xefetch (url, options) {
  var request = options._request
  var mockItem = mateMockItem(request)
  if (mockItem) {
    mockItem.time = getScopeNumber(mockItem.options.timeout)
    return getXHRResponse(mockItem, request).then(function (response) {
      if (mockItem.options.template === true) {
        response.body = XETemplate(response.body)
      }
      if (mockItem.options.log) {
        console.info('[XEAjaxMock] URL: ' + url + '\nMethod: ' + options.method + ' => Status: ' + (response ? response.status : 'canceled') + ' => Time: ' + mockItem.time + 'ms')
        console.info(response)
      }
      return response
    })
  } else {
    return fetch(url, options)
  }
}

export function XEXMLHttpRequest () {
  this._mock = null
  this._xhr = null
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
