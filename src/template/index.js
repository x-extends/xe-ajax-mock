import { isObject, isArray, isString, objectEach, arrayEach, getScopeNumber, arraySample, objectAssign, objectKeys } from '../core/util'
import { buildTemplate } from './bulid'
import { tmplMethods } from './fn'

var keyRule = /(.+)\|(array|random)\(([0-9-]+)\)$/

export function XETemplate (tmpl) {
  var result = null
  result = parseValueRule(tmpl, new TemplateOpts())
  if (isObject(result)) {
    var keys = objectKeys(result)
    if (keys.length === 1 && keys[0] === '!return') {
      result = result[keys[0]]
    }
  }
  return result
}

function parseValueRule (value, opts) {
  if (value) {
    if (isArray(value)) {
      return parseArray(value, opts)
    }
    if (isObject(value)) {
      return parseObject(value, opts)
    }
    if (isString(value)) {
      return buildTemplate(value, opts)
    }
  }
  return value
}

function parseArray (array, opts) {
  var result = []
  arrayEach(array, function (value, index) {
    var options = new TemplateOpts(opts, array, value, index)
    result.push(parseValueRule(value, options))
  })
  return result
}

function parseObject (obj, opts) {
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
            rest = parseArray(isRandom ? arraySample(value, len) : value.slice(0, len), opts)
            if (isRandom && rest.length === 1) {
              rest = rest[0]
            }
          } else {
            rest = parseArray(value, opts)
          }
        } else {
          rest = []
          for (var index = 0; index < len; index++) {
            var op = new TemplateOpts(opts, rest, null, index)
            rest.push(parseValueRule(value, op))
          }
        }
      }
    } else {
      rest = parseValueRule(value, opts)
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

function TemplateOpts (parent, obj, value, index) {
  this.$parent = parent
  this.$obj = obj
  this.$value = value
  this.$index = index
}

function mixinTemplateOpts (methods) {
  return objectAssign(TemplateOpts.prototype, methods)
}

XETemplate.mixin = mixinTemplateOpts
mixinTemplateOpts(tmplMethods)

export default XETemplate
