import { isObject, isArray, isString, objectEach, arrayEach, getRandom, getScopeNumber, arraySample, objectAssign, objectKeys } from './util'

var keyRule = /(.+)\|(array|random)\(([0-9-]+)\)$/

function XETemplate (tmpl) {
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
            rest = parseArray(isRandom ? arraySample(value, len) : value.slice(0, len))
            if (isRandom && rest.length === 1) {
              rest = rest[0]
            }
          } else {
            rest = value
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

objectAssign(TemplateOpts.prototype, {
  random: getRandom
})

var tmplJoint = {
  tStart: '__restArr=[]',
  tEnd: "return __restArr.join('');",
  contStart: "__restArr.push('",
  contEnd: "');\n",
  contTrimEnd: "'.trim());\n",
  cStart: '__restArr.push(',
  cEnd: ');\n',
  simplifyRegExp: /__restArr\.push\('\s*'\);/g
}

function buildCode (code) {
  return tmplJoint.contEnd + code + tmplJoint.contStart
}

function buildTemplate (strTmpl, data) {
  var restTmpl = strTmpl
  .replace(/[\r\n\t]/g, ' ')
  .replace(/{{\s*(.*?)\s*}}/g, function (matching, code) {
    return buildCode(tmplJoint.cStart + code + tmplJoint.cEnd)
  })
  try {
    restTmpl = 'var ' + tmplJoint.tStart + ';with(opts){' + tmplJoint.contStart + restTmpl + tmplJoint.contEnd + '};' + tmplJoint.tEnd
    /* eslint-disable no-new-func */
    return new Function('opts', restTmpl.replace(tmplJoint.simplifyRegExp, ''))(data)
  } catch (e) {
    console.error(e)
  }
  return strTmpl
}

export default XETemplate
