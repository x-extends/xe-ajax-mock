# XEAjaxMock 前端虚拟服务 - XEAjax插件

[![npm version](https://img.shields.io/npm/v/xe-ajax-mock.svg?style=flat-square)](https://www.npmjs.org/package/xe-ajax-mock)
[![npm downloads](https://img.shields.io/npm/dm/xe-ajax-mock.svg?style=flat-square)](http://npm-stat.com/charts.html?package=xe-ajax-mock)

基于 XEAjax 扩展的前端虚拟服务插件，对于前后端分离开发模式，使用 ajax+mock 就非常有必要。

### 兼容性
任何支持 Promise 的环境都能运行，低版本浏览器使用 polyfill<br/>
支持 IE8+、Edge、Chrome、Firefox、Opera、Safari等...

### CDN 安装
使用 script 方式安装，XEAjaxMock 会定义为全局变量<br/>
生产环境请使用 xe-ajax-mock.min.js，更小的压缩版本，可以带来更快的速度体验。
#### cdnjs 获取最新版本, [点击浏览](https://cdn.jsdelivr.net/npm/xe-ajax-mock/)已发布的所有 npm 包的源代码。
``` shell
<script src="https://cdn.jsdelivr.net/npm/xe-ajax-mock@1.5.1/dist/xe-ajax-mock.js"></script>
```
#### unpkg 获取最新版本, [点击浏览](https://unpkg.com/xe-ajax-mock@1.5.1/)已发布的所有 npm 包的源代码
``` shell
<script src="https://unpkg.com/xe-ajax-mock@1.5.1/dist/xe-ajax-mock.js"></script>
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
  // 定义 Mock 服务
  XEAjaxMock.GET('/api/user/list', {status: 200, body: {msg: 'success'}})
  // 定义 Mock 服务
  XEAjaxMock.GET('/api/user/page/{pageSize}/{currentPage}', function (request, response) {
    // 响应为本地 json 文件数据
    return response.require('mock/json/api/user/list/data.json')
  })
})

// ./app.js 调用
define(['xe-ajax'], function (XEAjax) {
  // 调用
  XEAjax.getJSON('/api/user/list', {id: 1}).then(function (data) {
    // data = {msg: 'success'}
  })
})
```

### ES6 Module 安装方式
``` shell
npm install xe-ajax xe-ajax-mock --save
```

### 部分导入
``` shell
import { GET, POST } from 'xe-ajax-mock'

GET('/api/user/list', {id: 1})
POST('/api/user/save', {id: 1})
```

### 导入所有
``` shell
import XEAjaxMock from 'xe-ajax-mock'

XEAjaxMock.GET('/api/user/list', {id: 1})
XEAjaxMock.POST('/api/user/save', {id: 1})
```

### 混合函数
#### 文件 ./customs.js
``` shell
export function m1 () {
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
XEAjaxMock.m1()
```

## XEAjaxMock API
### 'xe-ajax-mock' 提供的便捷方法：
* Mock( defines, options )
* Mock( path, method, response, options )
* GET( path, response, options )
* POST( path, response, options )
* PUT( path, response, options )
* DELETE( path, response, options )
* PATCH( path, response, options )
* JSONP( path, response, options )
* setup( options )

### 接受两个参数：
* defines（数组）定义多个
* options （可选，对象）参数
### 接受四个参数：
* path（字符串）请求地址 占位符{key}支持动态路径: 例如: /api/list/{key1}/{key2} 匹配 /api/list/10/1
* method（字符串）请求方法 | 默认GET
* jsonp（字符串）调用jsonp服务回调函数名，例如: 'callback'
* response（对象/方法(request, response, context)）数据或返回数据方法 {status: 200, body: {}, headers: {}}
* options （可选，对象）参数

### 参数说明
| 参数 | 类型 | 描述 | 值 |
|------|------|-----|----|
| baseURL | String | 基础路径 | 默认上下文路径 |
| timeout | String | 模拟请求时间 | 默认'20-400' |
| headers | Object | 设置响应头 |  |
| error | Boolean | 控制台输出 Mock Error 日志 | true |
| log | Boolean | 控制台输出 Mock Request 日志 | true |

### 全局参数
``` shell
import XEAjaxMock from 'xe-ajax-mock'

XEAjaxMock.setup({
  baseURL: 'http://xuliangzhan.com',
  timeout: '100-500',
  headers: {
    'Content-Type': 'application/javascript; charset=UTF-8'
  },
  error: true,
  log: true
})
```

### 目录结构
XEAjaxMock 对虚拟服务目录结构不限制，当虚拟服务越来越多时，统一目录结构可维护性会更好

ES6 + Vue + XEAjax + Mock 项目例子1 请参考 [vue-mock1](https://github.com/xuliangzhan/xe-ajax-mock/tree/master/examples/vue-mock1) 示例<br/>
RequireJS + Vue + XEAjax + Mock 项目例子2 请参考 [vue-mock2](https://github.com/xuliangzhan/xe-ajax-mock/tree/master/examples/vue-mock2) 示例<br/>
Vue +RequireJS + Vue + VXEAjax + Mock 项目例子3 请参考 [vue-mock3](https://github.com/xuliangzhan/xe-ajax-mock/tree/master/examples/vue-mock3) 示例

### 示例1
``` shell
import { Mock, GET, POST, PUT, PATCH, DELETE, JSONP } from 'xe-ajax-mock'

// 对象方式
GET('/api/user/list', {status: 200, body: {msg: 'success'}})

// 动态路径
PUT('/api/user/list/{pageSize}/{currentPage}', (request, response, context) => {
  // 获取路径参数 context.pathVariable
  // context.pathVariable.pageSize 10
  // context.pathVariable.currentPage 1
  response.status = 200
  response.headers = {'content-type': 'application/json;charset=UTF-8'}
  response.body = {pageVO: context.pathVariable, result: []}
  return response
})

// 函数方式
POST('/api/user/save', (request, response) => {
  return {status: 200, body: {msg: 'success'}}
})

// ES5 require 异步获取资源文件方式
POST('/api/user/save', (request, response) => {
  response.status = 200
  return response.require('mock/json/api/user/save/data.json')
})

// ES6 Module require 异步获取资源文件方式
POST('/api/user/save', (request, response) => {
  response.status = 200
  response.body = require('mock/json/api/user/save/data.json')
  return response
})

// Promise 异步方式
PATCH('/api/user/patch', (request, response) => {
  return new Promise( (resolve, reject) => {
    setTimeout(() = {
      response.status = 200
      response.body = [{msg: 'data 1'}, {msg: 'data 2'}]
      resolve(response)
    }, 100)
  })
})

// 函数方式,简单模拟后台校验
DELETE('/api/user/del', (request, response) => {
  // 模拟后台逻辑 对参数进行校验
  if (request.params.id) {
    response.status = 200
    response.body = {msg: 'success'}
  } else {
    response.status = 500
    response.body = {msg: 'error'}
  }
  return response
})

// JSONP 定义
JSONP('http://xuliangzhan.com/jsonp/user/message', (request, response) => {
  // response.status = 500 设置调用为失败
  response.body = [{msg: 'data 1'}, {msg: 'data 2'}]
  return response
})

// 配置方式定义
Mock([{
  path: '/api/user',
  children: [{
    method: 'POST',
    path: 'submit',
    response: {status: 200, body: {msg: 'success'}},
  },
  {
    method: 'DELETE',
    path : 'del',
    response (request, response) {
      response.status = 500
      response.body = {msg: 'error'}
      return response
    }
  ]
}])
```

### 示例2
``` shell
import XEAjaxMock from 'xe-ajax-mock'

// 定义
XEAjaxMock.Mock('/api/user/list', 'GET', (request, response) => {
  response.body = {msg: 'success'}
  return response
})

// 快捷定义
XEAjaxMock.GET('/api/user/list', {status: 200, body: {msg: 'success'}})
XEAjaxMock.POST('/api/user/save', {status: 200, body: {msg: 'success'}})
XEAjaxMock.PUT('/api/user/update', {status: 200, body: {msg: 'success'}})
XEAjaxMock.DELETE('/api/user/delete', {status: 200, body: {msg: 'success'}})
XEAjaxMock.PATCH('/api/user/patch', {status: 200, body: {msg: 'success'}})
XEAjaxMock.JSONP('http://xuliangzhan.com/jsonp/user/message', {status: 200, body: {msg: 'success'}})

// 配置方式定义
XEAjaxMock.Mock([{
  path: '/api/user',
  children: [{
    method: 'POST',
    path: 'submit',
    response: {status: 200, body: {msg: 'success'}},
  },
  {
    method: 'DELETE',
    path : 'del',
    response (request, response) {
      response.status = 500
      response.body = {msg: 'error'}
      return response
    }
  ]
}])
```

### 正常调用,自动拦截响应
``` shell
import { getJSON, postJSON, putJSON, deleteJSON, patchJSON, jsonp } from 'xe-ajax'

getJSON('/api/user/list/10/1').then(data => {
  // data = {msg: 'success'}
})

postJSON('/api/user/save').catch(data => {
  // data = {msg: 'error'}
})

putJSON('/api/user/update').then(data => {
  // data = {msg: 'success'}
})

deleteJSON('/api/user/del').then(data => {
  // data
}).catch(data => {
  // data = {msg: 'error'}
})

patchJSON('/api/user/patch').then(data => {
  // data = {msg: 'success'}
})

jsonp('http://xuliangzhan.com/jsonp/user/message').then(data => {
  // data = [{msg: 'data 1'}, {msg: 'data 2'}]
})
```

## License
Copyright (c) 2017-present, Xu Liangzhan