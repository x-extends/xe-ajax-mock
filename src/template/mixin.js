'use strict'

var utils = require('../core/utils')

var tmplMixinExports = {
  random: {
    num: utils.getRandom,
    time: function (startDate, endDate, format) {
      if (startDate) {
        if (!endDate) {
          return utils.toStringDate(startDate, format).getTime()
        }
        return utils.getRandom(utils.toStringDate(startDate, format).getTime(), utils.toStringDate(endDate, format).getTime())
      }
      return startDate
    },
    date: function (startDate, endDate, format) {
      if (startDate) {
        if (!endDate) {
          return utils.toDateString(startDate, format)
        }
        return utils.toDateString(tmplMixinExports.random.time(startDate, endDate), format)
      }
      return startDate
    },
    repeat: function (array, min, max) {
      min = min || 1
      max = max || min
      if (utils.isString(array)) {
        array = array.split('')
      }
      if (array.length < max) {
        var result = array
        while (result.length < max) {
          result = result.concat(array)
        }
        result.length = max
        array = result
      }
      return utils.arraySample(array, utils.getRandom(min, max)).join('')
    }
  }
}

module.exports = tmplMixinExports
