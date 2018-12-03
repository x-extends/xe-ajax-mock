const { template } = require('../index')

describe('Template functions', () => {
  test('template()', () => {
    expect(template({ 'num|number': '123' })).toEqual({ num: 123 })
  })
})
