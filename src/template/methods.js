import { isString, getRandom, arraySample, stringToDate, dateToString } from '../core/util'

export var tmplMethods = {
  random: {
    num: getRandom,
    time: function (startDate, endDate, format) {
      if (startDate) {
        if (!endDate) {
          return stringToDate(startDate, format).getTime()
        }
        return getRandom(stringToDate(startDate, format).getTime(), stringToDate(endDate, format).getTime())
      }
      return startDate
    },
    date: function (startDate, endDate, format) {
      if (startDate) {
        if (!endDate) {
          return dateToString(startDate, format)
        }
        return dateToString(tmplMethods.random.time(startDate, endDate), format)
      }
      return startDate
    },
    repeat: function (array, min, max) {
      min = min || 1
      max = max || min
      if (isString(array)) {
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
      return arraySample(array, getRandom(min, max)).join('')
    }
  }
}
