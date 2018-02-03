import { objectAssign } from './src/util'
import XEAjaxMock, * as mock from './src/mock'

/**
 * 混合函数
 *
 * @param {Object} methods 扩展
 */
function mixin (methods) {
  return objectAssign(XEAjaxMock, methods)
}

mixin(mock)
XEAjaxMock.mixin = mixin

export * from './src/mock'
export default XEAjaxMock
