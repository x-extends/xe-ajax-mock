export var isArray = Array.isArray || function (obj) {
  return obj ? obj.constructor === Array : false
}

export function isDate (val) {
  return val ? val.constructor === Date : false
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

var dateFormatRules = [
  {rules: [['yyyy', 4], ['yyy', 3], ['yy', 2]]},
  {rules: [['MM', 2], ['M', 1]], offset: -1},
  {rules: [['dd', 2], ['d', 1]]},
  {rules: [['HH', 2], ['H', 1]]},
  {rules: [['mm', 2], ['m', 1]]},
  {rules: [['ss', 2], ['s', 1]]},
  {rules: [['SSS', 3], ['SS', 2], ['S', 1]]}
]

export function stringToDate (str, format) {
  if (str) {
    if (isDate(str)) {
      return str
    }
    if (!isNaN(str)) {
      return new Date(str)
    }
    if (isString(str)) {
      format = format || 'yyyy-MM-dd HH:mm:ss.SSS'
      var dates = []
      arrayEach(dateFormatRules, function (item) {
        for (var arr, sIndex, index = 0, rules = item.rules, len = rules.length; index < len; index++) {
          arr = rules[index]
          sIndex = format.indexOf(arr[0])
          if (sIndex > -1) {
            dates.push(parseFloat(str.substring(sIndex, sIndex + arr[1]) || 0) + (item.offset || 0))
            break
          } else if (index === len - 1) {
            dates.push(0)
          }
        }
      })
      return new Date(dates[0], dates[1], dates[2], dates[3], dates[4], dates[5], dates[6])
    }
  }
  return 'Invalid Date'
}

export function dateToString (date, format) {
  date = stringToDate(date)
  if (isDate(date)) {
    var result = format || 'yyyy-MM-dd HH:mm:ss'
    var weeks = ['日', '一', '二', '三', '四', '五', '六']
    var resDate = {
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'M+': date.getMonth() + 1,
      'E+': date.getDay(),
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'S': date.getMilliseconds()
    }
    if (/(y+)/.test(result)) {
      result = result.replace(RegExp.$1, ('' + date.getFullYear()).substr(4 - RegExp.$1.length))
    }
    arrayEach(objectKeys(resDate), function (key) {
      if (new RegExp('(' + key + ')').test(result)) {
        var val = '' + resDate[key]
        result = result.replace(RegExp.$1, (key === 'q+' || key === 'E+') ? weeks[val] : (RegExp.$1.length === 1 ? val : ('00' + val).substr(val.length)))
      }
    })
    return result
  }
  return date
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
