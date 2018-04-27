'use strict'

var utils = require('./util')
var setupDefaults = {
  baseURL: utils.getBaseURL(),
  template: false,
  pathVariable: true,
  timeout: '20-400',
  headers: null,
  error: true,
  log: false
}

module.exports = setupDefaults
