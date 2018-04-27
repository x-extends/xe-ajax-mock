'use strict'

var utils = require('../core/util')
var buildTemplate = require('./bulid')
var tmplMixinExports = require('./mixin')

var keyRule = /(.+)\|(array|random)\((.+)\)$/

function XETemplate (tmpl, fns) {
  var result = null
  result = parseValueRule(tmpl, new TemplateMethods({}, fns))
  if (utils.isObject(result)) {
    var keys = utils.objectKeys(result)
    if (keys.length === 1 && (keys[0] === '!return' || keys[0] === '~')) {
      result = result[keys[0]]
    }
  }
  return result
}

function parseValueRule (value, methods) {
  if (value) {
    if (utils.isArray(value)) {
      return parseArray(value, methods)
    }
    if (utils.isObject(value)) {
      return parseObject(value, methods)
    }
    if (utils.isString(value)) {
      return buildTemplate(value, methods)
    }
  }
  return value
}

function parseArray (array, methods) {
  var result = []
  utils.arrayEach(array, function (value, index) {
    var options = new TemplateMethods({$parent: methods, $obj: array, $value: value, $size: array.length, $index: index}, methods.$fns)
    result.push(parseValueRule(value, options))
  })
  return result
}

function parseObject (obj, methods) {
  var result = {}
  utils.objectEach(obj, function (value, key) {
    var keyMatch = key.match(keyRule)
    var rest = null
    if (keyMatch && keyMatch.length === 4) {
      key = keyMatch[1]
      var isRandom = keyMatch[2].toLowerCase() === 'random'
      if (keyMatch[2].toLowerCase() === 'array' || isRandom) {
        var len = utils.getScopeNumber(buildTemplate(keyMatch[3], methods))
        if (utils.isArray(value)) {
          if (value.length > len) {
            rest = parseArray(isRandom ? utils.arraySample(value, len) : value.slice(0, len), methods)
            if (isRandom && rest.length === 1) {
              rest = rest[0]
            }
          } else {
            rest = parseArray(value, methods)
          }
        } else {
          rest = []
          for (var index = 0; index < len; index++) {
            var op = new TemplateMethods({$parent: methods, $obj: rest, $value: null, $size: len, $index: index}, methods.$fns)
            rest.push(parseValueRule(value, op))
          }
        }
      }
    } else {
      rest = parseValueRule(value, methods)
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

function TemplateMethods (methods, fns) {
  this.$fns = fns
  utils.objectAssign(this, fns, methods)
}

XETemplate.mixin = function (methods) {
  return utils.objectAssign(TemplateMethods.prototype, methods)
}

XETemplate.mixin(tmplMixinExports)

module.exports = XETemplate
