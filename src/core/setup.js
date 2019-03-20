'use strict'

var utils = require('./utils')
var setupDefaults = {
  baseURL: utils.getBaseURL(),
  template: false,
  pathVariable: true,
  timeout: '20-400',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  },
  error: true,
  log: false
}

module.exports = setupDefaults
