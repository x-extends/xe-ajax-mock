var utils = require('../core/util')

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
    this._mock = utils.mateMockItem(this._request)
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
        mockXHR._updateResponse(request, {status: xhr.status, body: xhr.response})
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
          var response = {status: 0, body: ''}
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
      this['on' + name]({type: name})
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

module.exports = xhrExports
