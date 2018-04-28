
'use strict'

var utils = require('../core/utils')
var mockStore = require('../core/store')

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

module.exports = handleExports
