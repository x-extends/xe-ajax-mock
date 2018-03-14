import { getScopeNumber } from '../core/util'
import { mateMockItem } from '../core/mock'

var $global = typeof window === 'undefined' ? this : window

/**
 * jsonp
 */
export function xejsonp (script, request, resolve, reject) {
  var mockItem = mateMockItem(request)
  $global[request.jsonpCallback] = function (body) {
    resolve({status: 200, body: body})
  }
  if (mockItem) {
    mockItem.time = getScopeNumber(mockItem.options.timeout)
    return mockItem.getMockResponse(mockItem, request).then(function (response) {
      if (response.status < 200 || response.status >= 300) {
        script.onerror({type: 'error'})
      } else {
        $global[request.jsonpCallback](response.body)
      }
      mockItem.outMockLog(mockItem, request, response)
    })
  } else {
    var url = request.getUrl()
    script.type = 'text/javascript'
    script.src = url + (url.indexOf('?') === -1 ? '?' : '&') + request.jsonp + '=' + request.jsonpCallback
    script.onerror = function (evnt) {
      resolve({status: 500, body: ''})
    }
    script.onabort = function (evnt) {
      resolve({status: 0, body: ''})
    }
    if (request.timeout) {
      setTimeout(function () {
        script.onabort()
      }, request.timeout)
    }
    document.body.appendChild(script)
  }
}
