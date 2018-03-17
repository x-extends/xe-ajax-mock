import { objectAssign } from './src/core/util'
import { XEAjaxMock, install, setup } from './src/core/mock'
import { exportMethods } from './src/core/methods'

/**
 * 混合函数
 *
 * @param {Object} methods 扩展
 */
function mixin (methods) {
  return objectAssign(XEAjaxMock, methods)
}

objectAssign(XEAjaxMock, {
  mixin: mixin,
  setup: setup,
  install: install,
  version: '1.6.8',
  $name: 'XEAjaxMock'
})

mixin(exportMethods)

export * from './src/core'
export default XEAjaxMock
