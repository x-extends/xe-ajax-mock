# XEAjaxMock 前端虚拟服务 - XEAjax插件

[![npm version](https://img.shields.io/npm/v/xe-ajax-mock.svg?style=flat-square)](https://www.npmjs.org/package/xe-ajax-mock)
[![npm downloads](https://img.shields.io/npm/dm/xe-ajax-mock.svg?style=flat-square)](http://npm-stat.com/charts.html?package=xe-ajax-mock)

基于 XEAjax 扩展的前端虚拟服务插件，对于前后端分离开发模式，ajax+mock 使前端独立开发就非常有必要。

## 兼容性
基于 Promise 实现，低版本浏览器使用 polyfill es6-promise.js  
支持 IE8+、Edge、Chrome、Firefox、Opera、Safari等...

## CDN 安装
使用 script 方式安装，XEAjaxMock 会定义为全局变量  
生产环境请使用 xe-ajax-mock.min.js，更小的压缩版本，可以带来更快的速度体验。
### cdnjs 获取最新版本
[点击浏览](https://cdn.jsdelivr.net/npm/xe-ajax-mock/)已发布的所有 npm 包源码
``` shell
<script src="https://cdn.jsdelivr.net/npm/xe-ajax-mock@1.6.0/dist/xe-ajax-mock.js"></script>
```
### unpkg 获取最新版本
[点击浏览](https://unpkg.com/xe-ajax-mock@1.6.0/)已发布的所有 npm 包源码
``` shell
<script src="https://unpkg.com/xe-ajax-mock@1.6.0/dist/xe-ajax-mock.js"></script>
```

## AMD 安装
### require.js 安装示例
``` shell
// require 配置
require.config({
  paths: {
    // ...,
    'xe-ajax': './dist/xe-ajax.min',
    'xe-ajax-mock': './dist/xe-ajax-mock.min'
  }
})

// ./mock/index.js 配置文件
define(['xe-ajax', 'xe-ajax-mock'], function (XEAjax, XEAjaxMock) {
  // 安装
  XEAjax.use(XEAjaxMock)
})
```

## ES6 Module 安装方式
``` shell
npm install xe-ajax xe-ajax-mock --save
```

### import 部分导入
``` shell
import { GET, POST } from 'xe-ajax-mock'

GET('/api/user/list', {msg: 'success'})
POST('/api/user/save', {msg: 'success'})
```

### import 导入所有
``` shell
import XEAjaxMock from 'xe-ajax-mock'

XEAjaxMock.GET('/api/user/list', {msg: 'success'})
XEAjaxMock.POST('/api/user/save', {msg: 'success'})
```

## API
### 提供的便捷方法：
* setup( options )
* Mock( defines, options )
* Mock( path, method, response, options )
* 
* GET( path, response, options )
* POST( path, response, options )
* PUT( path, response, options )
* DELETE( path, response, options )
* PATCH( path, response, options )
* HEAD( path, response, options )
* JSONP( path, response, options )

### 入参
* path（字符串）请求地址，占位符{key}支持动态路径: 例如: /api/list/{key1}/{key2} 匹配 /api/list/10/1
* method（字符串）请求方法 | 默认GET
* response（对象/方法(request, response, context)）数据或返回数据方法 {status: 200, body: {}, headers: {}}
* options （可选，对象）参数

### options 参数说明
| 参数 | 类型 | 描述 | 值 |
|------|------|-----|----|
| baseURL | String | 基础路径 | 默认上下文路径 |
| template | Boolean | 启用模板自动编译 | 默认false |
| timeout | String | 模拟请求时间 | 默认'20-400' |
| jsonp | String | 调用jsonp服务,属性名默认callback | 默认callback |
| headers | Object | 设置响应头 |  |
| error | Boolean | 控制台输出 Mock Error 日志 | true |
| log | Boolean | 控制台输出 Mock Request 日志 | true |

## 全局参数设置
``` shell
import XEAjaxMock from 'xe-ajax-mock'

XEAjaxMock.setup({
  baseURL: 'http://xuliangzhan.com',
  template: true,
  timeout: '100-500',
  headers: {
    'Content-Type': 'application/javascript; charset=UTF-8'
  },
  error: true,
  log: true
})
```

## 模板语法 - 属性
### 数值
[key]|number
``` shell
import { template } from 'xe-ajax-mock'

template({
  'num|number': '123'
})
// 结果: {num: 123}
```
### 布尔值
[key]|boolean
``` shell
import { template } from 'xe-ajax-mock'

template({
  'flag1|boolean': 'true',
  'flag2|boolean': 'false'
})
// 结果: {flag1: true, flag2: false}
```
### 生成一个或多个数组
[key]|array([min]-[max])
``` shell
import { template } from 'xe-ajax-mock'

template({
  'region|array(1-5)': '值'
})
// 结果: {region: ['值', '值', '值']}

template({
  'region|array(1)': ['深圳', '北京', '上海', '广州']
})
// 结果: {region: ['深圳']}

template({
  'region|array(1-3)': ['深圳', '北京', '上海', '广州']
})
// {region: ['深圳', '北京']}
```
### 随机生成一个或多个值
[key]|random([min]-[max])
``` shell
import { template } from 'xe-ajax-mock'

template({
  'region|random(1-5)': '值'
})
// 结果: {region: ['值', '值', '值']}

template({
  'region|random(1)': ['深圳', '北京', '上海', '广州']
})
// 结果: {region: '深圳'}

template({
  'region|random(1-3)': ['深圳', '北京', '上海', '广州']
})
// 结果: {region: ['上海', '北京']}
```
### 对象
``` shell
import { template } from 'xe-ajax-mock'

// 输出对象
template({
  'id|number': '1',
  'name': 'test 1',
  'region|array(1)': ['深圳', '北京', '上海', '广州'],
  'active|boolean': '{{ random.num(0,1) }}'
  'age|number': '{{ random.num(18,60) }}'
})
// 结果: {id: 1,name: 'test 1', region: ['深圳'], active: false, age: 30}
```
### 输出对象数组
!return|array([min]-[max])
``` shell
import { template } from 'xe-ajax-mock'

// 输出对象数组，索引{{ $index }}
template({
  '!return|array(1-2)': {
    'id|number': '{{ $index+1 }}',
    'name': 'test {{ $index }}',
    'region|array(1)': ['深圳', '北京', '上海', '广州'],
    'active|boolean': '{{ random.num(0,1) }}',
    'age|number': '{{ random.num(18,60) }}'
  }
})
// 结果: [{id: 1,name: 'test 0', region: ['上海'], active: true, age: 30},
//       {id: 2, name: 'test 1', region: ['北京'], active: false, age: 42}]
```
## 模板语法 - 值
### 随机数值
random.num(min, max)
``` shell
import { template } from 'xe-ajax-mock'

template({
  'age': '{{ random.num(18,60) }}'
})
// 结果: {age: '30'}

template({
  'ip': '{{ random.num(1,254) }}.{{ random.num(1,254) }}.{{ random.num(1,254) }}.{{ random.num(1,254) }}'
})
// 结果: {ip: '147.136.43.175'}

template({
  'color': 'rgb({{ random.num(100,120) }}, {{ random.num(140,180) }}, {{ random.num(140,160) }})'
})
// 结果: {color: 'rgb(242, 121, 132)'}
```
### 根据内容随机生成值
random.repeat(array|string, min, max)
``` shell
import { template } from 'xe-ajax-mock'

template({
  'describe': '{{ random.repeat("随机产生一段文本",10,200) }}'
})
// 结果: {describe: '段生随本段段随机本一段段机本本一本段段随机'}

template({
  'email': '{{ random.repeat("abcdefg",5,20) }}@{{ random.repeat(["qq","163"],1) }}.{{ random.repeat(["com","net"],1) }}'
})
// 结果: {email: 'abcfdgecee@163.com'}
```
### 随机时间戳
random.time(startDate, endDate)
``` shell
import { template } from 'xe-ajax-mock'

template({
  'datetime': '{{ random.time("2018-03-04","2018-03-20") }}'
})
// 结果: {datetime: '1520611200000'}
```
### 随机日期
random.date(startDate, endDate)
``` shell
import { template } from 'xe-ajax-mock'

template({
  'dateStr': '{{ random.date("2018-03-04","2018-03-20") }}'
})
// 结果: {dateStr: '2018-03-10'}

template({
  'dateStr': '{{ random.date("2018-03-04","2018-03-20","yyyy-MM-dd HH:mm:ss.S") }}'
})
// 结果: {dateStr: '2018-03-10 10:30:20.500'}
```
### 混合函数
template.mixin({})
``` shell
import { template } from 'xe-ajax-mock'

template.mixin({
  format () {
    return '扩展函数'
  }
})

template({
  'val': '{{ format() }}'
})
// 结果: {val: '扩展函数'}
```

## 示例
### Mock
``` shell
Mock([{
  path: '/api/user',
  children: [{
    method: 'GET',
    path: 'list',
    response: {status: 200, body: [{name: 'test1'}]},
  }, {
    method: 'POST',
    path: 'submit',
    response: {msg: 'success'},
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
### GET
``` shell
import { GET } from 'xe-ajax-mock'

GET('/api/user/list', {msg: 'success'})

GET('/api/user/list', (request, response) => {
  response.body = template({
    '!return|array(1-3)': {
      name: 'list {{ $index }}'
    }
  })
  return response
})

GET('/api/user/list/{pageSize}/{currentPage}', (request, response, context) => {
  // 获取路径参数 context.pathVariable
  // context.pathVariable.pageSize 10
  // context.pathVariable.currentPage 1
  response.status = 200
  response.headers = {'content-type': 'application/json;charset=UTF-8'}
  response.body = {pageVO: context.pathVariable, result: []}
  return response
})
```
### POST
``` shell
import { template, POST } from 'xe-ajax-mock'

POST('/api/user/save', {msg: 'success'})

POST('/api/user/save', (request, response) => {
  response.body = {msg: 'success'}
  return response
})

POST('/api/user/save', (request, response) => {
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
```
### PUT
``` shell
import { PUT } from 'xe-ajax-mock'

PUT('/api/user/update', {msg: 'success'})

PUT('/api/user/update', (request, response) => {
  response.status = 500
  response.body = {msg: 'error'}
  return response
})
```
### DELETE
``` shell
import { DELETE } from 'xe-ajax-mock'

DELETE('/api/user/del', {msg: 'success'})

DELETE('/api/user/del', (request, response) => {
  response.body = {msg: 'success'}
  return response
})
```
### PATCH
``` shell
import { PATCH } from 'xe-ajax-mock'

PATCH('/api/user/update', {msg: 'success'})
```
### HEAD
``` shell
import { HEAD } from 'xe-ajax-mock'

HEAD('/api/user/head')
```
### JSONP
``` shell
import { template, JSONP } from 'xe-ajax-mock'

JSONP('http://xuliangzhan.com/jsonp/user/message', (request, response) => {
  response.body = template({
    '!return|array(1-3)': {
      name: '名字{{ $index }}'
    }
  })
  return response
})
```
### AMD 使用方式
``` shell
define([
  'xe-ajax-mock'
], function (XEAjaxMock) {

  XEAjaxMock.GET('/api/user/list', {msg: 'success'})

  XEAjaxMock.GET('/api/user/list', (request, response) => {
    return response.require('mock/json/api/user/list/data.json')
  })

  XEAjaxMock.POST('/api/user/save', (request, response) => {
    response.body = {msg: 'success'}
    return response
  })

  XEAjaxMock.POST('/api/user/save', (request, response) => {
    return response.require('mock/json/api/user/save/data.json')
  })
})
```

## 混合函数
### 文件 ./customs.js
``` shell
export function m1 () {
  console.log('自定义的函数')
} 
```
### 示例 ./main.js
``` shell
import Vue from 'vue'
import XEAjaxMock from 'xe-ajax-mock'

import customs from './customs'

XEAjaxMock.mixin(customs)

// 调用自定义扩展函数
XEAjaxMock.m1()
```

## 完整项目示例
XEAjaxMock 对虚拟服务目录结构不限制，当虚拟服务配置越来越多时，统一目录结构可维护性会更好

ES6、Vue、VueRouter、VueI18n、ElementUI、VXEAjax、Mock 项目 [点击查看](https://github.com/xuliangzhan/xe-ajax-mock/tree/master/examples/vue-element1)  
ES6、Vue、VueRouter、VueI18n、ElementUI、XEAjax、Mock 项目 [点击查看](https://github.com/xuliangzhan/xe-ajax-mock/tree/master/examples/vue-element1)  
ES6、Vue、VueRouter、XEAjax、Mock 项目 [点击查看](https://github.com/xuliangzhan/xe-ajax-mock/tree/master/examples/vue-mock1)  
RequireJS、Vue、VueRouter、VueI18n、XEAjax、Mock 项目 [点击查看](https://github.com/xuliangzhan/xe-ajax-mock/tree/master/examples/vue-mock2)  
RequireJS、Vue、VueRouter、VueI18n、VXEAjax、Mock 项目 [点击查看](https://github.com/xuliangzhan/xe-ajax-mock/tree/master/examples/vue-mock3)

## License
Copyright (c) 2017-present, Xu Liangzhan