import { isFunction, getLocatOrigin, objectAssign } from '../core/util'
import { setupDefaults } from '../core/mock'

var requireMap = {}

function parseRequire (response, path) {
  response.body = null
  try {
    response.body = JSON.parse(requireMap[path])
  } catch (e) {
    response.body = requireMap[path]
  }
  return response
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
export function getXHRResponse (mock, request) {
  return new Promise(function (resolve, reject) {
    mock.asyncTimeout = setTimeout(function () {
      if (!request.$complete) {
        if (isFunction(mock.response)) {
          return resolve(mock.response(request, new XEMockResponse(mock, null, 200), mock))
        }
        return Promise.resolve(mock.response).then(function (response) {
          resolve(new XEMockResponse(mock, response, 200))
        }).catch(function (response) {
          reject(new XEMockResponse(mock, response, 500))
        })
      }
    }, mock.time)
  })
}
