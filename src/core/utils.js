'use strict'

var objectToString = Object.prototype.toString

var dateFormatRules = [
  { rules: [['yyyy', 4], ['yyy', 3], ['yy', 2]] },
  { rules: [['MM', 2], ['M', 1]], offset: -1 },
  { rules: [['dd', 2], ['d', 1]] },
  { rules: [['HH', 2], ['H', 1]] },
  { rules: [['mm', 2], ['m', 1]] },
  { rules: [['ss', 2], ['s', 1]] },
  { rules: [['SSS', 3], ['SS', 2], ['S', 1]] }
]

var utils = {

  isArray: Array.isArray || function (val) {
    return objectToString.call(val) === '[object Array]'
  },

  isDate: function (val) {
    return objectToString.call(val) === '[object Date]'
  },

  isObject: function (val) {
    return typeof val === 'object'
  },

  isFunction: function (obj) {
    return typeof obj === 'function'
  },

  isString: function (val) {
    return typeof val === 'string'
  },

  getRandom: function (min, max) {
    return min >= max ? min : ((min = min || 0) + Math.round(Math.random() * ((max || 9) - min)))
  },

  toStringDate: function (str, format) {
    if (str) {
      if (utils.isDate(str)) {
        return str
      }
      if (!isNaN(str)) {
        return new Date(str)
      }
      if (utils.isString(str)) {
        format = format || 'yyyy-MM-dd HH:mm:ss.SSS'
        var dates = []
        utils.arrayEach(dateFormatRules, function (item) {
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
  },

  toDateString: function (date, format) {
    date = utils.toStringDate(date)
    if (utils.isDate(date)) {
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
      var result = String(format || 'yyyy-MM-dd HH:mm:ss').replace(/(y+)/, function ($1) {
        return ('' + date.getFullYear()).substr(4 - $1.length)
      })
      for (var key in resDate) {
        if (resDate.hasOwnProperty(key)) {
          var val = '' + resDate[key]
          result = result.replace(new RegExp('(' + key + ')'), function ($1) {
            return (key === 'q+' || key === 'E+') ? weeks[val] : ($1.length === 1 ? val : ('00' + val).substr(val.length))
          })
        }
      }
      return result
    }
    return date
  },

  objectAssign: Object.assign || function (target) {
    for (var source, index = 1, len = arguments.length; index < len; index++) {
      source = arguments[index]
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  },

  arrayEach: function (array, callback, context) {
    if (array.forEach) {
      return array.forEach(callback, context)
    }
    for (var index = 0, len = array.length || 0; index < len; index++) {
      callback.call(context || global, array[index], index, array)
    }
  },

  objectEach: function (obj, iteratee, context) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        iteratee.call(context || this, obj[key], key, obj)
      }
    }
  },

  objectKeys: function (obj) {
    var result = []
    if (obj) {
      if (Object.keys) {
        return Object.keys(obj)
      }
      utils.objectEach(obj, function (val, key) {
        result.push(key)
      })
    }
    return result
  },

  objectValues: function (obj) {
    if (Object.values) {
      return obj ? Object.values(obj) : []
    }
    var result = []
    utils.arrayEach(utils.objectKeys(obj), function (key) {
      result.push(obj[key])
    })
    return result
  },

  arrayShuffle: function (array) {
    var result = []
    for (var list = utils.objectValues(array), len = list.length - 1; len >= 0; len--) {
      var index = len > 0 ? utils.getRandom(0, len) : 0
      result.push(list[index])
      list.splice(index, 1)
    }
    return result
  },

  arraySample: function (array, number) {
    var result = utils.arrayShuffle(array)
    if (arguments.length === 1) {
      return result[0]
    }
    if (number < result.length) {
      result.length = number || 0
    }
    return result
  },

  getLocatOrigin: function () {
    return typeof location === 'undefined' ? '' : (location.origin || (location.protocol + '//' + location.host))
  },

  getBaseURL: function () {
    if (typeof location === 'undefined') {
      return ''
    }
    var pathname = location.pathname
    var lastIndex = utils.lastIndexOf(pathname, '/') + 1
    return utils.getLocatOrigin() + (lastIndex === pathname.length ? pathname : pathname.substring(0, lastIndex))
  },

  lastIndexOf: function (str, val) {
    if (utils.isFunction(str.lastIndexOf)) {
      return str.lastIndexOf(val)
    } else {
      for (var len = str.length - 1; len >= 0; len--) {
        if (val === str[len]) {
          return len
        };
      }
    }
    return -1
  },

  getScopeNumber: function (str) {
    var matchs = String(str).match(/(\d+)-(\d+)/)
    return matchs && matchs.length === 3 ? utils.getRandom(parseInt(matchs[1]), parseInt(matchs[2])) : (isNaN(str) ? 0 : Number(str))
  }
}

module.exports = utils
