# XEAjaxMock 轻量级虚拟服务 - XEAjax插件

### 直接引用 script 全局安装，XEAjaxMock 会定义为全局变量
``` shell
<script src="./dist/xe-ajax.min.js" type="text/javascript"></script>
<script src="./dist/xe-ajax-mock.min.js" type="text/javascript"></script>

// /main.js 安装
XEAjax.use(XEAjaxMock)
XEAjaxMock.GET('services/user/list', {msg: 'success'})

// ./app.js 调用
XEAjax.getJSON ('services/user/list', {id: 1}) // 响应结果：{msg: 'success'}
```

### AMD 安装， 以 require.js 为例
``` shell
// require 配置
require.config({
  paths: {
    // ...,
    'xe-ajax': './dist/xe-ajax.min',
    'xe-ajax-mock': './dist/xe-ajax-mock.min'
  }
})

// ./mock.js 配置文件
define(['xe-ajax', 'xe-ajax-mock'], function (XEAjax, XEAjaxMock) {
  // 安装
  XEAjax.use(XEAjaxMock)
  // 定义
  XEAjaxMock.GET('services/user/list', {status: 200, response: {msg: 'success'}})
})

// ./app.js 调用
define(['xe-ajax'], function (XEAjax) {
  // 调用
  XEAjax.getJSON('services/user/list', {id: 1}) // 响应结果：{msg: 'success'}
})
```

### ES6 Module 安装方式
``` shell
npm install xe-ajax --save
npm install xe-ajax-mock --save
```

### 部分引入
``` shell
import { GET, POST } from 'xe-ajax-mock'

GET('services/user/list', {id: 1})
POST('services/user/save', {id: 1})
```

### 引入所有
``` shell
import XEAjaxMock from 'xe-ajax-mock'

XEAjaxMock.GET('services/user/list', {id: 1})
XEAjaxMock.POST('services/user/save', {id: 1})
```

### 混合函数
#### 文件 ./customs.js
``` shell
export function custom1 () {
  console.log('自定义的函数')
} 
```
#### 示例
``` shell
import Vue from 'vue'
import XEAjaxMock from 'xe-ajax-mock'

import customs from './customs'

XEAjaxMock.mixin(customs)

// 调用自定义扩展函数
XEAjaxMock.custom1()
```

## XEAjaxMock API
### 'xe-ajax-mock' 提供的便捷方法：
* Mock( defines, options )
* Mock( path, method, xhr, options )
* GET( path, xhr, options )
* POST( path, xhr, options )
* PUT( path, xhr, options )
* DELETE( path, xhr, options )
* PATCH( path, xhr, options )
* setup( options )

### 接受两个参数：
* defines（数组）定义多个
* options （可选，对象）参数
### 接受四个参数：
* path（字符串）请求地址 占位符{key}支持动态路径: 例如: services/list/{key1}/{key2} 匹配 services/list/10/1
* method（字符串）请求方法 | 默认GET
* xhr（对象/方法(request, xhr)）数据或返回数据方法 {status: 200, response: [], headers: {}}
* options （可选，对象）参数

### 参数说明
| 参数 | 类型 | 描述 | 值 |
|------|------|-----|----|
| baseURL | String | 基础路径 |  |
| timeout | String | 模拟请求时间 | 默认'20-400' |
| log | Boolean | 控制台输出 Mock 日志 | true |

### 全局参数
``` shell
import XEAjaxMock from 'xe-ajax-mock'

XEAjaxMock.setup({
  baseURL: 'http://xuliangzhan.com',
  timeout: '100-500'
})
```

### 示例1
``` shell
import { GET, POST, PUT, PATCH, DELETE } from 'xe-ajax-mock'

// 对象方式
GET('services/user/list', {status: 200, response: {msg: 'success'}})
// 动态路径
PUT('services/user/list/{pageSize}/{currentPage}', (request, xhr) => {
  // 获取路径参数 request.pathVariable
  // request.pathVariable.pageSize 10
  // request.pathVariable.currentPage 1
  xhr.status = 200
  xhr.headers = {'content-type': 'application/json;charset=UTF-8'}
  xhr.response = {pageVO: this.pathVariable, result: []}
  return xhr
})
// 函数方式
POST('services/user/save', (request, xhr) => {
  return {status: 200, response: {msg: 'success'}}
})
// 异步方式
PATCH('services/user/patch', (request, xhr) => {
  return new Promise( (resolve, reject) => {
    setTimeout(() = {
      xhr.status = 200
      xhr.response = {msg: 'success'}
      resolve(xhr)
    }, 100)
  })
})
// 函数方式,模拟后台校验
DELETE('services/user/del', (request, xhr) => {
  // 模拟后台逻辑 对参数进行校验
  if (request.params.id) {
    xhr.status = 200
    xhr.response = {msg: 'success'}
  } else {
    xhr.status = 500
    xhr.response = {msg: 'error'}
  }
  return xhr
})
```

### 示例2
``` shell
import XEAjaxMock from 'xe-ajax-mock'

// 快捷定义
XEAjaxMock.GET('services/user/list', {msg: 'success'})
XEAjaxMock.POST('services/user/save', {msg: 'success'})
XEAjaxMock.PUT('services/user/update', {msg: 'success'})
XEAjaxMock.DELETE('services/user/delete', {msg: 'success'})
XEAjaxMock.PATCH('services/user/patch', {msg: 'success'})

// 定义单个
XEAjaxMock('services/user/list', 'GET', (request, xhr) => {
  xhr.response = {msg: 'success'}
  return xhr
})

// 定义多个
XEAjaxMock([{
  path: 'services/user',
  children: [{
    method: 'POST',
    path: 'submit',
    xhr: {status: 200, response: {msg: 'success'}},
  },
  {
    method: 'DELETE',
    path : 'del',
    xhr (request, xhr) {
      xhr.status = 500
      xhr.response = {msg: 'error'}
      return xhr
    }
  ]
}])
```

### 正常调用,自动拦截响应
``` shell
import { doGet, getJSON, postJSON, deleteJSON } from 'xe-ajax'

doGet('services/user/list').then(response => {
  // response.status = 200
  // response.body = {msg: 'success'}
})
getJSON('services/user/list/10/1').then(data => {
  // data = {msg: 'success'}
})

postJSON('services/save', {id: 111}).then(data => {
  // data = {msg: 'success'}
})

postJSON('services/user/save').catch(data => {
  // data = {msg: 'error'}
})

patchJSON('services/user/patch').then(data => {
  // data = {msg: 'success'}
})

postJSON('services/user/submit').then(data => {
  // data = {msg: 'success'}
})

deleteJSON('services/user/del').catch(data => {
  // data = {msg: 'error'}
})
```

## License
Copyright (c) 2017-present, Xu Liangzhan