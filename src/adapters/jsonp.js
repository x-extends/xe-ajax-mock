import { getScopeNumber } from '../core/util'
import { mateMockItem } from '../core/mock'

var $global = typeof window === 'undefined' ? this : window

function jsonpClear (request) {
  if (request.script.parentNode === document.body) {
    document.body.removeChild(request.script)
  }
  try {
    delete $global[request.jsonpCallback]
  } catch (e) {
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
export function xejsonp (script, request) {
  return new Promise(function (resolve, reject) {
    var mockItem = mateMockItem(request)
    $global[request.jsonpCallback] = function (body) {
      jsonpSuccess(request, {status: 200, body: body}, resolve)
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
