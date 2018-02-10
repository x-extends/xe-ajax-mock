export var isArray = Array.isArray || function (obj) {
  return obj ? obj.constructor === Array : false
}

export function isFunction (obj) {
  return typeof obj === 'function'
}

export function random (min, max) {
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

export function getBaseURL () {
  var pathname = location.pathname
  var lastIndex = lastIndexOf(pathname, '/') + 1
  return location.origin + (lastIndex === pathname.length ? pathname : pathname.substring(0, lastIndex))
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
