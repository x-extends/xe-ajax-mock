import { objectAssign } from './src/core/util'
import { Mock, install, setup } from './src/core/mock'
import { exportMethods } from './src/core/methods'

/**
 * 混合函数
 *
 * @param {Object} methods 扩展
 */
function mixin (methods) {
  return objectAssign(Mock, methods)
}

objectAssign(Mock, {
  mixin: mixin,
  setup: setup,
  install: install,
  version: '1.6.4',
  $name: 'XEAjaxMock'
})

mixin(exportMethods)

export * from './src/core/mock'
export default Mock
