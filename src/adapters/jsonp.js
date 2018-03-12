import { getScopeNumber } from '../core/util'
import { mateMockItem } from '../core/mock'
import { getXHRResponse } from '../core/response'

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
    return getXHRResponse(mockItem, request).then(function (response) {
      var url = request.getUrl()
      if (request.validateStatus(response)) {
        $global[request.jsonpCallback](response.body)
        if (mockItem.options.log) {
          console.info('[XEAjaxMock] URL: ' + url + '\nMethod: ' + request.method + ' => Status: ' + (response ? response.status : 'canceled') + ' => Time: ' + mockItem.time + 'ms')
          console.info(response)
        }
      } else {
        script.onerror({type: 'error'})
        if (mockItem.options.error) {
          console.error('JSONP ' + url + ' ' + response.status)
        }
      }
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
