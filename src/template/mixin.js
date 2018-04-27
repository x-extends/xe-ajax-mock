'use strict'

var utils = require('../core/util')

var tmplMixinExports = {
  random: {
    num: utils.getRandom,
    time: function (startDate, endDate, format) {
      if (startDate) {
        if (!endDate) {
          return utils.stringToDate(startDate, format).getTime()
        }
        return utils.getRandom(utils.stringToDate(startDate, format).getTime(), utils.stringToDate(endDate, format).getTime())
      }
      return startDate
    },
    date: function (startDate, endDate, format) {
      if (startDate) {
        if (!endDate) {
          return utils.dateToString(startDate, format)
        }
        return utils.dateToString(tmplMixinExports.random.time(startDate, endDate), format)
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
