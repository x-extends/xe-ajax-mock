export var isArray = Array.isArray || function (obj) {
  return obj ? obj.constructor === Array : false
}

export function isObject (val) {
  return typeof val === 'object'
}

export function isFunction (obj) {
  return typeof obj === 'function'
}

export function isString (val) {
  return typeof val === 'string'
}

export function getRandom (min, max) {
  return min >= max ? min : ((min = min || 0) + Math.round(Math.random() * ((max || 9) - min)))
}

export var objectAssign = Object.assign || function (target) {
  for (var source, index = 1, len = arguments.length; index < len; index++) {
    source = arguments[index]
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key]
      }
    }
  }
  return target
}

export function arrayEach (array, callback, context) {
  if (array.forEach) {
    return array.forEach(callback, context)
  }
  for (var index = 0, len = array.length || 0; index < len; index++) {
    callback.call(context || global, array[index], index, array)
  }
}

export function objectEach (obj, iteratee, context) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      iteratee.call(context || this, obj[key], key, obj)
    }
  }
}

export function objectKeys (obj) {
  var result = []
  if (obj) {
    if (Object.keys) {
      return Object.keys(obj)
    }
    objectEach(obj, function (val, key) {
      result.push(key)
    })
  }
  return result
}

export function objectValues (obj) {
  if (Object.values) {
    return obj ? Object.values(obj) : []
  }
  var result = []
  arrayEach(objectKeys(obj), function (key) {
    result.push(obj[key])
  })
  return result
}

export function arrayShuffle (array) {
  var result = []
  for (var list = objectValues(array), len = list.length - 1; len >= 0; len--) {
    var index = len > 0 ? getRandom(0, len) : 0
    result.push(list[index])
    list.splice(index, 1)
  }
  return result
}

export function arraySample (array, number) {
  var result = arrayShuffle(array)
  if (arguments.length === 1) {
    return result[0]
  }
  if (number < result.length) {
    result.length = number || 0
  }
  return result
}

export function getLocatOrigin () {
  return location.origin || (location.protocol + '//' + location.host)
}

export function getBaseURL () {
  var pathname = location.pathname
  var lastIndex = lastIndexOf(pathname, '/') + 1
  return getLocatOrigin() + (lastIndex === pathname.length ? pathname : pathname.substring(0, lastIndex))
}

export function lastIndexOf (str, val) {
  if (isFunction(str.lastIndexOf)) {
    return str.lastIndexOf(val)
  } else {
    for (var len = str.length - 1; len >= 0; len--) {
      if (val === str[len]) {
        return len
      };
    }
  }
  return -1
}

export function getScopeNumber (str) {
  var matchs = String(str).match(/(\d+)-(\d+)/)
  return matchs && matchs.length === 3 ? getRandom(parseInt(matchs[1]), parseInt(matchs[2])) : (isNaN(str) ? 0 : Number(str))
}
