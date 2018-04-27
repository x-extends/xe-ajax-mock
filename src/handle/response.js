'use strict'

var utils = require('../core/utils')
var XETemplate = require('../template')
var setupDefaults = require('../core/setup')

var requireMap = {}

function parseRequire (response, path) {
  try {
    return JSON.parse(requireMap[path])
  } catch (e) {}
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
    response = XETemplate(response, {$pathVariable: mockItem.pathVariable, $params: request.params || {}, $body: request.body || {}})
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

module.exports = XEMockResponse
