var utils = require('../core/utils')

function MockResult (request, mockItem, pathVariable) {
  this.request = request
  this.pathVariable = pathVariable
  this.context = mockItem
  this.waiting = utils.getScopeNumber(mockItem.options.timeout)
  this._waitingTimeout = null
}

module.exports = MockResult
