define([
  'vue',
  'vue-router',
  'home'
], function (Vue, VueRouter, Home) {
  Vue.use(VueRouter)
  var exports = {
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home
      }
    ]
  }
  return new VueRouter(exports)
})
