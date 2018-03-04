<template>
  <div>

    <h1>{{ title }} + {{ dateStr }}</h1>

    <p>渲染 /api/shopping/findList 列表</p>
    <ul>
      <li v-for="(item, index) in shoppingList" :key="index">{{ item.name }}</li>
    </ul>

    <p>渲染 /api/user/list/page/10/1 列表</p>
    <ul>
      <li v-for="(item, index) in userList" :key="index">{{ item.name }}</li>
    </ul>

    <div class="loading-demo" v-show="loading"> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> </div>

    <p>模拟服务端校验密码大于六位数</p>
    <button @click="save">保存</button>
    <input type="test" v-model="userForm.name" placeholder="输入用户名">
    <input type="test" v-model="userForm.password" placeholder="输入密码">
    <div v-show="successMsg">调用成功：{{ successMsg }}</div>
    <div style="color: red;" v-show="errorMsg">调用失败：{{ errorMsg }}</div>

  </div>
</template>

<script>
import { fetchGet, getJSON, postJSON, jsonp } from 'xe-ajax'
import { dateToString } from 'xe-utils'

export default {
  data () {
    return {
      title: 'vue + xe-ajax 3.0 + mock 例子',
      dateStr: dateToString(new Date(), 'MM/dd/yyyy HH:mm:ss'),
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
    init () {
      // 返回响应结果
      getJSON('/api/shopping/findList').then(data => {
        // 请求成功
        this.shoppingList = data
      }).catch(data => {
        // 请求失败
        this.shoppingList = []
      })
      // 返回 response 对象
      fetchGet('/api/user/list/page/10/1').then(response => {
        if (response.ok) {
          // 请求成功
          response.json().then(data => {
            this.userList = data.result
          })
        } else {
          // 请求失败
          this.userList = []
        }
      })
      // 跨域调用 jsonp 服务,返回数据
      jsonp('http://xuliangzhan.com/api/user/message').then(data => {
        // 请求成功
      }).catch(data => {
        // 请求失败
      })
    },
    save () {
      // 保存
      this.loading = true
      postJSON('/api/user/save', this.userForm).then(data => {
        // 请求成功
        this.loading = false
        this.errorMsg = null
        this.successMsg = data
      }).catch(data => {
        // 请求失败
        this.loading = false
        this.successMsg = null
        this.errorMsg = data
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
.loading-demo {
  width: 100px;
  height: 100px;
  position: relative;
  margin: 0 auto;
  margin-top: 100px;
}
.loading-demo span {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: lightgreen;
  position: absolute;
  animation: load 1.04s ease infinite;
}
@keyframes load {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
.loading-demo span:nth-child(1) {
  left: 0;
  top: 50%;
  margin-top: -8px;
  animation-delay: 0.13s;
}
.loading-demo span:nth-child(2) {
  left: 14px;
  top: 14px;
  animation-delay: 0.26s;
}
.loading-demo span:nth-child(3) {
  left: 50%;
  top: 0;
  margin-left: -8px;
  animation-delay: 0.39s;
}
.loading-demo span:nth-child(4) {
  top: 14px;
  right: 14px;
  animation-delay: 0.52s;
}
.loading-demo span:nth-child(5) {
  right: 0;
  top: 50%;
  margin-top: -8px;
  animation-delay: 0.65s;
}
.loading-demo span:nth-child(6) {
  right: 14px;
  bottom: 14px;
  animation-delay: 0.78s;
}
.loading-demo span:nth-child(7) {
  bottom: 0;
  left: 50%;
  margin-left: -8px;
  animation-delay: 0.91s;
}
.loading-demo span:nth-child(8) {
  bottom: 14px;
  left: 14px;
  animation-delay: 1.04s;
}
</style>
