define([
  'xe-ajax',
  'xe-utils',
  'text!views/home.html'
], function (XEAjax, XEUtils, tmpl) {
  var exports = {
    template: tmpl,
    data: function () {
      return {
        title: 'vue + xe-ajax 3.0 + mock 例子',
        dateStr: XEUtils.dateToString(new Date(), 'MM/dd/yyyy HH:mm:ss'),
        loading: false,
        userList: [],
        shoppingList: [],
        testList: [],
        userForm: {
          name: null,
          password: null
        },
        successMsg: null,
        errorMsg: null
      }
    },
    methods: {
      init: function () {
        var that = this
        // 返回响应结果
        XEAjax.getJSON('/api/shopping/findList').then(function (data) {
          // 请求成功
          that.shoppingList = data
        }).catch(function (data) {
          // 请求失败
          that.shoppingList = []
        })
        // 返回 response 对象
        XEAjax.fetchGet('/api/user/list/page/10/1').then(function (response) {
          if (response.ok) {
            // 请求成功
            response.json().then(function (data) {
              that.userList = data.result
            })
          } else {
            // 请求失败
            that.userList = []
          }
        })
        // 跨域调用 jsonp 服务,返回数据
        XEAjax.jsonp('http://xuliangzhan.com/api/user/message').then(function (data) {
          // 请求成功
        }).catch(function (data) {
          // 请求失败
        })
      },
      save: function () {
        // 保存
        var that = this
        this.loading = true
        XEAjax.fetchPost('/api/user/save', this.userForm).then(function (response) {
          that.loading = false
          response.json().then(function (data) {
            if (response.ok) {
              // 请求成功
              that.errorMsg = null
              that.successMsg = data
            } else {
              // 请求失败
              that.successMsg = null
              that.errorMsg = data
            }
          })
        })
      }
    },
    created: function () {
      this.init()
    }
  }
  return exports
})
