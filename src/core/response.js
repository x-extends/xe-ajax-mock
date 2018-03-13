import { isFunction, getLocatOrigin, objectAssign } from '../core/util'
import { setupDefaults, template } from './mock'

var requireMap = {}

function parseRequire (response, path) {
  try {
    return JSON.parse(requireMap[path])
  } catch (e) {}
  return requireMap[path]
}

export function requireJSON (path) {
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
    response = template(response, {$pathVariable: mockItem.pathVariable, $params: request.params || {}, $body: request.body || {}})
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

/**
 * 响应结果
 */
export function getXHRResponse (mockItem, request) {
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
}
