define([
  'text!views/home.html'
], function (tmpl) {
  var exports = {
    template: tmpl,
    data: function () {
      return {
        title: 'vue + xe-ajax 3.0 + mock 例子',
        dateStr: this.$utils.dateToString(new Date(), 'MM/dd/yyyy HH:mm:ss'),
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
        // 返回响应结果
        this.$ajax.getJSON('/api/shopping/findList').then(function (data) {
          // 请求成功
          this.shoppingList = data
        }).catch(function (data) {
          // 请求失败
          this.shoppingList = []
        })
        // 返回 response 对象
        this.$ajax.fetchGet('/api/user/list/page/10/1').then(function (response) {
          if (response.ok) {
            // 请求成功
            response.json().then(function (data) {
              this.userList = data.result
            })
          } else {
            // 请求失败
            this.userList = []
          }
        })
        // 跨域调用 jsonp 服务,返回数据
        this.$ajax.jsonp('http://xuliangzhan.com/api/user/message').then(function (data) {
          // 请求成功
        }).catch(function (data) {
          // 请求失败
        })
      },
      save: function () {
        // 保存
        this.loading = true
        this.$ajax.fetchPost('/api/user/save', this.userForm).then(function (response) {
          this.loading = false
          response.json().then(function (data) {
            if (response.ok) {
              // 请求成功
              this.errorMsg = null
              this.successMsg = data
            } else {
              // 请求失败
              this.successMsg = null
              this.errorMsg = data
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
