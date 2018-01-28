import XEAjaxMock, * as mock from './src/mock'

/**
 * 函数扩展
 *
 * @param {Object} methods 扩展函数对象
 */
function mixin (methods) {
  return Object.assign(XEAjaxMock, methods)
}

mixin(mock)
XEAjaxMock.mixin = mixin

export * from './src/mock'
export default XEAjaxMock
