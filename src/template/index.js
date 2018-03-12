import { isObject, isArray, isString, objectEach, arrayEach, getScopeNumber, arraySample, objectAssign, objectKeys } from '../core/util'
import { buildTemplate } from './bulid'
import { tmplMethods } from './fn'

var keyRule = /(.+)\|(array|random)\(([0-9-]+)\)$/

export function XETemplate (tmpl, fns) {
  var result = null
  result = parseValueRule(tmpl, new TemplateMethods({}, fns))
  if (isObject(result)) {
    var keys = objectKeys(result)
    if (keys.length === 1 && keys[0] === '!return') {
      result = result[keys[0]]
    }
  }
  return result
}

function parseValueRule (value, tmplMethods) {
  if (value) {
    if (isArray(value)) {
      return parseArray(value, tmplMethods)
    }
    if (isObject(value)) {
      return parseObject(value, tmplMethods)
    }
    if (isString(value)) {
      return buildTemplate(value, tmplMethods)
    }
  }
  return value
}

function parseArray (array, tmplMethods) {
  var result = []
  arrayEach(array, function (value, index) {
    var options = new TemplateMethods({$parent: tmplMethods, $obj: array, $value: value, $size: array.length, $index: index}, tmplMethods.$fns)
    result.push(parseValueRule(value, options))
  })
  return result
}

function parseObject (obj, tmplMethods) {
  var result = {}
  objectEach(obj, function (value, key) {
    var keyMatch = key.match(keyRule)
    var rest = null
    if (keyMatch && keyMatch.length === 4) {
      key = keyMatch[1]
      var isRandom = keyMatch[2].toLowerCase() === 'random'
      if (keyMatch[2].toLowerCase() === 'array' || isRandom) {
        var len = getScopeNumber(keyMatch[3])
        if (isArray(value)) {
          if (value.length > len) {
            rest = parseArray(isRandom ? arraySample(value, len) : value.slice(0, len), tmplMethods)
            if (isRandom && rest.length === 1) {
              rest = rest[0]
            }
          } else {
            rest = parseArray(value, tmplMethods)
          }
        } else {
          rest = []
          for (var index = 0; index < len; index++) {
            var op = new TemplateMethods({$parent: tmplMethods, $obj: rest, $value: null, $size: len, $index: index}, tmplMethods.$fns)
            rest.push(parseValueRule(value, op))
          }
        }
      }
    } else {
      rest = parseValueRule(value, tmplMethods)
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
  objectAssign(this, fns, methods)
}

function mixinTemplateMethods (methods) {
  return objectAssign(TemplateMethods.prototype, methods)
}

XETemplate.mixin = mixinTemplateMethods
mixinTemplateMethods(tmplMethods)

export default XETemplate
