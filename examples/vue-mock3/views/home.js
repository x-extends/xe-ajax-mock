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
          this.shoppingList = data
        }).catch(function (data) {
          this.shoppingList = []
        })
        // 返回 response 对象
        this.$ajax.fetchGet('/api/user/list/page/10/1').then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              this.userList = data
            })
          } else {
            this.userList = []
          }
        })
      },
      save: function () {
        // 保存
        this.loading = true
        this.$ajax.postJSON('/api/user/save', this.userForm).then(function (data) {
          this.loading = false
          this.errorMsg = null
          this.successMsg = data
        }).catch(function (data) {
          this.loading = false
          this.successMsg = null
          this.errorMsg = data
        })
      }
    },
    created: function () {
      this.init()
    }
  }
  return exports
})
