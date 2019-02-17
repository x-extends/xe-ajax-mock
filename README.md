# xe-ajax-mock

[![npm version](https://img.shields.io/npm/v/xe-ajax-mock.svg?style=flat-square)](https://www.npmjs.org/package/xe-ajax-mock)
[![npm build](https://travis-ci.org/xuliangzhan/xe-ajax-mock.svg?branch=master)](https://travis-ci.org/xuliangzhan/xe-ajax-mock)
[![npm downloads](https://img.shields.io/npm/dm/xe-ajax-mock.svg?style=flat-square)](http://npm-stat.com/charts.html?package=xe-ajax-mock)
[![npm license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/xuliangzhan/xe-ajax-mock/blob/master/LICENSE)

基于 xe-ajax 的 Mock 虚拟服务

## Browser Support

![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- | --- |
9+ ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 8+ ✔ |

## Installing

[Using cdnjs](https://cdn.jsdelivr.net/npm/xe-ajax-mock/)

```HTML
<script src="https://cdn.jsdelivr.net/npm/xe-ajax-mock/dist/xe-ajax-mock.js"></script>
```

[Using unpkg](https://unpkg.com/xe-ajax-mock/)

```HTML
<script src="https://unpkg.com/xe-ajax-mock/dist/xe-ajax-mock.js"></script>
```

```JavaScript
require.config({
  paths: {
    // ...,
    'xe-ajax': './dist/xe-ajax.min',
    'xe-ajax-mock': './dist/xe-ajax-mock.min'
  }
})
define(['xe-ajax', 'xe-ajax-mock'], function (XEAjax, XEAjaxMock) {
  XEAjax.use(XEAjaxMock)
})
```

## API

* Mock( defines, options )
* Mock( path, method, response, options )
* HEAD( path, response, options )
* GET( path, response, options )
* POST( path, response, options )
* PUT( path, response, options )
* DELETE( path, response, options )
* PATCH( path, response, options )
* JSONP( path, response, options )

### Arguments

* **path** 请求路径
* **method** 请求方法
* **response** 对象或者函数(request, response, context)，格式: {status: 200, statusText: 'OK', body: {}, headers: {}}
* **options** 参数

### 参数

| Name | Type | Description | default value |
|------|------|-----|----|
| baseURL | String | 基础路径 | 默认上下文路径 |
| template | Boolean | 是否允许数据模板自动编译, 可以设置 [**true**,**false**] | 默认 false |
| pathVariable | Boolean | 是否启用路径参数类型自动解析, 可以设置 [**true**,**false**,'auto'] | 默认 true |
| timeout | String | 设置请求响应的时间 | 默认 '20-400' |
| jsonp | String | 设置jsonp回调参数名称 |  |
| headers | Object | 设置响应头信息 |  |
| error | Boolean | 控制台输出请求错误日志, 可以设置 [**true**,**false**] | 默认 true |
| log | Boolean | 控制台输出请求请求日志, 可以设置 [**true**,**false**] | 默认 false |

## 全局参数

```JavaScript
import XEAjaxMock from 'xe-ajax-mock'

XEAjaxMock.setup({
  baseURL: 'http://xuliangzhan.com',
  template: true,
  pathVariable: 'auto', // 如果为auto则支持自动转换类型
  timeout: '50-600',
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  error: true,
  log: true
})
```

## Template - 基础语法

### Number 数值

[key]|number

```JavaScript
import { template } from 'xe-ajax-mock'

template({
  'num|number': '123'
})
// {num: 123}
```

### Boolean 布尔值

[key]|boolean

```JavaScript
import { template } from 'xe-ajax-mock'

template({
  'flag1|boolean': 'true',
  'flag2|boolean': 'false'
})
// {flag1: true, flag2: false}
```

### 指定生成一个或多个值

[key]|array([min]-[max])

```JavaScript
import { template } from 'xe-ajax-mock'

template({
  'region|array(1-5)': 'val'
})
// {region: ['val', 'val', 'val']}

template({
  'region|array(1)': ["beijing", "shanghai", "guangzhou", "shenzhen"]
})
// {region: ['beijing']}

template({
  'region|array(1-3)': ["beijing", "shanghai", "guangzhou", "shenzhen"]
})
// {region: ['shenzhen', 'shanghai']}
```

### 随机生成一个或多个值

[key]|random([min]-[max])

```JavaScript
import { template } from 'xe-ajax-mock'

template({
  'region|random(1-5)': 'val'
})
// {region: ['val', 'val', 'val']}

template({
  'region|random(1)': ["beijing", "shanghai", "guangzhou", "shenzhen"]
})
// {region: 'shanghai'}

template({
  'region|random(1-3)': ["beijing", "shanghai", "guangzhou", "shenzhen"]
})
// {region: ['beijing', 'guangzhou']}
```

### Object 对象

```JavaScript
import { template } from 'xe-ajax-mock'

template({
  'id|number': '1',
  'name': 'test 1',
  'region|array(1)': ["beijing", "shanghai", "guangzhou", "shenzhen"],
  'active|boolean': '1'
  'age|number': '30'
})
// {id: 1,name: 'test 1', region: ['shanghai'], active: true, age: 30}
```

### Array 数组

```JavaScript
import { template } from 'xe-ajax-mock'

template(['{{ random.repeat("abcdefg",10,20) }}', '{{ random.date("2018-03-04","2018-03-20") }}'])
// ['gbabcdefega', '2018-03-13 14:52:02']

template([{
  'id|number': '1',
  'name': 'test1',
  'region|array(1)': ["beijing", "shanghai", "guangzhou", "shenzhen"],
  'active|boolean': '0',
  'age|number': '30'
}])
// [{id: 1,name: 'test 0', region: ['guangzhou'], active: false, age: 30}]
```

### 内置变量

**$size** 获取数组大小
**$index** 获取数组索引
**$params** 获取请求查询参数
**$body** 获取请求提交参数
**$pathVariable** 获取请求路径参数

```JavaScript
import { template } from 'xe-ajax-mock'

template({
  'result|array(1-5)': {
    'id|number': '{{ $index }}',
    'size|number': '{{ $size }}',
    'name': '{{ $params.name }}',
    'password': '{{ $body.password }}'
  }
})
// {
//   age: {pageSize: 10, currentPage: 1},
//   result: [
//     {id: 0, size: 2, name: 'test', password: ''},
//     {id: 1, size: 2, name: 'test', password: ''}
//   ]
// }
```

### 直接返回对应的值

**~** 如果对象中只有一个属性，返回对应值

```JavaScript
import { template } from 'xe-ajax-mock'

template({
  '~': {
    'id|number': '1',
    'name': 'test {{ $index }}',
    'region|array(1)': ["beijing", "shanghai", "guangzhou", "shenzhen"],
    'active|boolean': '{{ random.num(0,1) }}',
    'age|number': '{{ random.num(18,60) }}'
  }
})
// {id: 1, name: 'test 0', region: ['shenzhen'], active: true, age: 30}

template({
  '~|array(1-2)': {
    'id|number': '{{ $index+1 }}',
    'name': 'test {{ $index }}',
    'region|array(1)': ["beijing", "shanghai", "guangzhou", "shenzhen"],
    'active|boolean': '{{ random.num(0,1) }}',
    'age|number': '{{ random.num(18,60) }}'
  }
})
// [{id: 1, name: 'test 0', region: ['shanghai'], active: true, age: 30},
// {id: 2, name: 'test 1', region: ['shenzhen'], active: false, age: 42}]
```

## Template - 函数的使用

### 随机生成数值

random.num(min, max)

```JavaScript
import { template } from 'xe-ajax-mock'

template({
  'age': '{{ random.num(18,60) }}'
})
// {age: '30'}

template({
  'ip': '{{ random.num(1,254) }}.{{ random.num(1,254) }}.{{ random.num(1,254) }}.{{ random.num(1,254) }}'
})
// {ip: '147.136.43.175'}

template({
  'color': 'rgb({{ random.num(100,120) }}, {{ random.num(140,180) }}, {{ random.num(140,160) }})'
})
// {color: 'rgb(242, 121, 132)'}
```

### 根据内容随机生成（可以是字符串或数组）

random.repeat(array|string, min, max)

```JavaScript
import { template } from 'xe-ajax-mock'

template({
  'describe': '{{ random.repeat("abcdefg",10,200) }}'
})
// {describe: 'bacdeggaccedbga'}

template({
  'email': '{{ random.repeat("abcdefg",5,20) }}@163.{{ random.repeat(["com","net"],1) }}'
})
// {email: 'abcfdgecee@163.com'}
```

### 随机时间戳

random.time(startDate, endDate)

```JavaScript
import { template } from 'xe-ajax-mock'

template({
  'datetime': '{{ random.time("2018-03-04") }}'
})
// {datetime: '1520092800000'}

template({
  'datetime': '{{ random.time("2018-03-04","2018-03-20") }}'
})
// {datetime: '1520611200000'}
```

### 随机日期

random.date(startDate, endDate, format)

```JavaScript
import { template } from 'xe-ajax-mock'

template({
  'dateStr': '{{ random.date("2018-03-04") }}'
})
// {dateStr: '2018-03-04'}

template({
  'dateStr': '{{ random.date("2018-03-04",null,"yyyy-MM-dd HH:mm:ss.S") }}'
})
// {dateStr: '2018-03-04 00:00:00.0'}

template({
  'dateStr': '{{ random.date("2018-03-04","2018-03-20") }}'
})
// {dateStr: '2018-03-10'}

template({
  'dateStr': '{{ random.date("2018-03-04","2018-03-20","yyyy-MM-dd HH:mm:ss.S") }}'
})
// {dateStr: '2018-03-10 10:30:20.500'}
```

### 完整配置

```JavaScript
import { template } from 'xe-ajax-mock'

// GET('http://xuliangzhan.com/api/user/list/{pageSize/{currentPage}') ==> XEAjax.fetchGet('api/user/list/10/1')
template({
  "page": {
    "currentPage|number": "{{ $pathVariable.currentPage }}",
    "pageSize|number": "{{ $pathVariable.pageSize }}",
    "totalResult|number": "{{ random.num(100,200) }}"
  },
  "result|array({{ $pathVariable.pageSize }})": {
    "id|number": "{{ $index+1 }}",
    "name": "test {{ $index }}",
    "region|random(1)": ["beijing", "shanghai", "guangzhou", "shenzhen"],
    "roles|array(1-3)": ["admin", "developer", "tester", "designer"],
    "isLogin|boolean": "{{ random.num(0,1) }}",
    "email": "{{ random.repeat('abcdefg',5,20) }}@qq.{{ random.repeat(['com','net'],1) }}",
    "color": "rgb(120, {{ random.num(140,180) }}, {{ random.num(140,160) }})",
    "ip": "192.168.{{ random.num(1,254) }}.{{ random.num(1,254) }}",
    "age|number": "{{ random.num(18,60) }}",
    "password": "{{ random.num(100000,999999) }}",
    "describe": "{{ random.repeat('abcdefg',10,200) }}",
    "createDate": "{{ random.date('2018-01-01','2018-06-20') }}",
    "updateTime": "{{ random.time('2018-01-01','2018-06-20') }}"
  }
})
```

### Template 模板混合函数

template.mixin({})

```JavaScript
import { template } from 'xe-ajax-mock'

template.mixin({
  format (str) {
    return 'format: ' + str
  }
})

template({
  'val': '{{ format("2018-01-01") }}'
})
// {val: 'format: 2018-01-01'}
```

## Example

[example](https://github.com/xuliangzhan/vue-mock-template)

### Mock

```JavaScript
import { Mock } from 'xe-ajax-mock'

Mock([{
  path: '/api/user',
  children: [{
    method: 'GET',
    path: 'list',
    response: {
      '~|array(1-3)': {
        'id|number': '{{ $index+1 }}',
        'name': '{{ random.repeat("abcdefg",4,20) }}'
      }
    },
  }, {
    method: 'POST',
    path: 'submit',
    response: {msg: 'success'},
  },
  {
    method: 'DELETE',
    path : 'delete/{id}',
    response (request, response) {
      response.status = 500
      response.body = {msg: 'error'}
      return response
    }
  ]
}])
```

### HEAD

```JavaScript
import { HEAD } from 'xe-ajax-mock'

HEAD('/api/user/head', null)
```

### GET

```JavaScript
import { GET } from 'xe-ajax-mock'

GET('/api/user/list', {msg: 'success'})

GET('/api/user/list', (request, response) => {
  response.status = 200
  response.statusText = 'OK'
  response.body = {
    '~|array(1-3)': {
      'id|number': '{{ $index+1 }}',
      'name': '{{ random.repeat("abcdefg",4,20) }}'
    }
  }
  return response
})

GET('/api/user/list/{pageSize}/{currentPage}', (request, response, context) => {
  response.body = {
    'page': {
      'currentPage|number': '{{ $pathVariable.currentPage }}',
      'pageSize|number': '{{ $pathVariable.pageSize }}'
    },
    'result|array(2-5)': {
      'id|number': '{{ $index+1 }}',
      'name': '{{ random.repeat("abcdefg",4,20) }}'
    }
  }
  return response
})
```

### POST

```JavaScript
import { template, POST } from 'xe-ajax-mock'

POST('/api/user/save', {msg: 'success'})

POST('/api/user/save', (request, response) => {
  response.body = {msg: 'success'}
  return response
})

POST('/api/user/save', (request, response) => {
  // 简单模拟后台校验
  if (request.params.id) {
    response.body = {msg: 'success'}
  } else {
    response.status = 500
    response.body = {msg: 'error'}
  }
  return response
})
```

### PUT

```JavaScript
import { PUT } from 'xe-ajax-mock'

PUT('/api/user/update', {msg: 'success'})

PUT('/api/user/update', (request, response) => {
  response.status = 500
  response.body = {msg: 'error'}
  return response
})
```

### DELETE

```JavaScript
import { DELETE } from 'xe-ajax-mock'

DELETE('/api/user/delete/{id}', {msg: 'success'})

DELETE('/api/user/delete/{id}', (request, response) => {
  response.body = {msg: 'success'}
  return response
})
```

### PATCH

```JavaScript
import { PATCH } from 'xe-ajax-mock'

PATCH('/api/user/update', {msg: 'success'})
```

### JSONP

```JavaScript
import { JSONP } from 'xe-ajax-mock'

JSONP('http://xuliangzhan.com/jsonp/user/message', {msg: 'success'})

JSONP('http://xuliangzhan.com/jsonp/user/message', (request, response) => {
  response.body = {
    '~|array(1-3)': {
      'id|number': '{{ $index+1 }}',
      'name': '{{ random.repeat("abcdefg",4,20) }}'
    }
  }
  return response
}， {jsonp: 'cb'})
```

## License

Copyright (c) 2017-present, Xu Liangzhan