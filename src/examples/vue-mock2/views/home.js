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
          that.shoppingList = data
        }).catch(function (data) {
          that.shoppingList = []
        })
        // 返回 response 对象
        XEAjax.fetchGet('/api/user/list/page/10/1').then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              that.userList = data.result
            })
          } else {
            that.userList = []
          }
        })
        // 跨域调用 jsonp 服务,返回数据
        XEAjax.jsonp('http://xuliangzhan.com/api/user/message').then(function (data) {
          // data = [{name: 'data 1'}, {name: 'data 2'}]
        }).catch(function (data) {
          // data
        })
      },
      save: function () {
        // 保存
        var that = this
        this.loading = true
        XEAjax.postJSON('/api/user/save', this.userForm).then(function (data) {
          that.loading = false
          that.errorMsg = null
          that.successMsg = data
        }).catch(function (data) {
          that.loading = false
          that.successMsg = null
          that.errorMsg = data
        })
      }
    },
    created: function () {
      this.init()
    }
  }
  return exports
})
