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
        // 如果要混合 vue 实例，可以使用 vxe-ajax 安装
        // this.$ajax.getJSON(url)
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
              that.userList = data
            })
          } else {
            that.userList = []
          }
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