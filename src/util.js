export var isArray = Array.isArray || function isArray (obj) {
  return obj ? obj.constructor === Array : false
}

export function isFunction (obj) {
  return typeof obj === 'function'
}

export function random (min, max) {
  return min >= max ? min : ((min = min || 0) + Math.round(Math.random() * ((max || 9) - min)))
}

export var objectAssign = Object.assign || function objectAssign (target) {
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
