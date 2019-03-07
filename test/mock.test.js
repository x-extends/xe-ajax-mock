const { template } = require('../index')

describe('Template functions', function () {
  test('template()', function () {
    expect(template({ 'num|number': '123' })).toEqual({ num: 123 })
  })
})
