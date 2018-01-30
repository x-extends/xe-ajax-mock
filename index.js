import XEAjaxMock, * as mock from './src/mock'

/**
 * 混合函数
 *
 * @param {Object} methods 扩展
 */
function mixin (methods) {
  return Object.assign(XEAjaxMock, methods)
}

mixin(mock)
XEAjaxMock.mixin = mixin

export * from './src/mock'
export default XEAjaxMock
