# xe-ajax-mock

[![npm version](https://img.shields.io/npm/v/xe-ajax-mock.svg?style=flat-square)](https://www.npmjs.org/package/xe-ajax-mock)
[![npm downloads](https://img.shields.io/npm/dm/xe-ajax-mock.svg?style=flat-square)](http://npm-stat.com/charts.html?package=xe-ajax-mock)

The Mock virtual service plug-in based on XEAjax extension supports XHR, fetch, jsonp request simulation, logic validation simulation, data template;For the development mode of the front and back separation, ajax+mock makes the front end no longer depend on the back-end interface development efficiency.

## Browser Support
xe-ajax-mock depends on a native ES6 Promise implementation to be supported. If your environment doesn't support ES6 Promises, you can polyfill.

![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_7-8/internet-explorer_7-8_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- | --- |
8+ ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 6.1+ ✔ |

## Installation
### npm
``` shell
npm install xe-ajax xe-ajax-mock --save
```
### CDN
[All cdnjs package](https://cdn.jsdelivr.net/npm/xe-ajax-mock/)
``` shell
<script src="https://cdn.jsdelivr.net/npm/xe-ajax-mock/dist/xe-ajax-mock.js"></script>
```
[All unpkg package](https://unpkg.com/xe-ajax-mock/)
``` shell
<script src="https://unpkg.com/xe-ajax-mock/dist/xe-ajax-mock.js"></script>
```
### AMD
``` shell
require.config({
  paths: {
    // ...,
    'xe-ajax': './dist/xe-ajax.min',
    'xe-ajax-mock': './dist/xe-ajax-mock.min'
  }
})
```

## API
* Mock( defines, options )
* Mock( path, method, response, options )
* 
* HEAD( path, response, options )
* GET( path, response, options )
* POST( path, response, options )
* PUT( path, response, options )
* DELETE( path, response, options )
* PATCH( path, response, options )
* JSONP( path, response, options )

### Arguments
* **path** request URL path
* **method** request method
* **response** Object or Function(request, response, context), format: {status: 200, statusText: 'OK', body: {}, headers: {}}
* **options** is an optional options object

### Options
| Name | Type | Description | default value |
|------|------|-----|----|
| baseURL | String | base URL | defaults to context path |
| template | Boolean | Enable data templates to compile automatically, You can set [**true**,**false**] | defaults to false |
| pathVariable | Boolean | Enable path parameter type automatic parsing, You can set [**true**,**false**] | defaults to true |
| timeout | String | Simulated request time | defaults to '20-400' |
| jsonp | String | set jsonp callback parameter name |  |
| headers | Object | optional header fields |  |
| error | Boolean | console output error log, You can set [**true**,**false**] | defaults to true |
| log | Boolean | console output request log, You can set [**true**,**false**] | defaults to false |

## Default global settings
``` shell
import XEAjaxMock from 'xe-ajax-mock'

XEAjaxMock.setup({
  baseURL: 'http://xuliangzhan.com',
  template: true,
  pathVariable: 'auto',
  timeout: '100-600',
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  error: true,
  log: true
})
```

## Template - Base
### Number
[key]|number
``` shell
import { template } from 'xe-ajax-mock'

template({
  'num|number': '123'
})
// {num: 123}
```
### Boolean
[key]|boolean
``` shell
import { template } from 'xe-ajax-mock'

template({
  'flag1|boolean': 'true',
  'flag2|boolean': 'false'
})
// {flag1: true, flag2: false}
```
### generate one or more values.
[key]|array([min]-[max])
``` shell
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
### Randomly generate one or more values.
[key]|random([min]-[max])
``` shell
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
### Object
``` shell
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
### Array
``` shell
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
### Buildin object
**$size** get the array size  
**$index** get array index  
**$params** get query parameters  
**$body** get request body  
**$pathVariable** get path variable
``` shell
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
//   result: [{id: 0, size: 2, name: 'test', password: ''}, {id: 1, size: 2, name: 'test', password: ''}]
// }
```
### Directly output the corresponding value.
**!return** there is only one property in the object. output corresponding value
``` shell
import { template } from 'xe-ajax-mock'

template({
  '!return': {
    'id|number': '1',
    'name': 'test {{ $index }}',
    'region|array(1)': ["beijing", "shanghai", "guangzhou", "shenzhen"],
    'active|boolean': '{{ random.num(0,1) }}',
    'age|number': '{{ random.num(18,60) }}'
  }
})
// {id: 1, name: 'test 0', region: ['shenzhen'], active: true, age: 30}

template({
  '!return|array(1-2)': {
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
## Template - Advanced
### Random number
random.num(min, max)
``` shell
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
### Randomly generate values based on content.
random.repeat(array|string, min, max)
``` shell
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
### Random timestamp
random.time(startDate, endDate)
``` shell
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
### Random Date
random.date(startDate, endDate, format)
``` shell
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
### Paging configuration
``` shell
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
### Template functions of mixing
template.mixin({})
``` shell
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

## Examples
### Mock
``` shell
import { Mock } from 'xe-ajax-mock'

Mock([{
  path: '/api/user',
  children: [{
    method: 'GET',
    path: 'list',
    response: {
      '!return|array(1-3)': {
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
``` shell
import { HEAD } from 'xe-ajax-mock'

HEAD('/api/user/head', null)
```
### GET
``` shell
import { GET } from 'xe-ajax-mock'

GET('/api/user/list', {msg: 'success'})

GET('/api/user/list', (request, response) => {
  response.status = 200
  response.statusText = 'OK'
  response.body = {
    '!return|array(1-3)': {
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
``` shell
import { template, POST } from 'xe-ajax-mock'

POST('/api/user/save', {msg: 'success'})

POST('/api/user/save', (request, response) => {
  response.body = {msg: 'success'}
  return response
})

POST('/api/user/save', (request, response) => {
  // The simulation logic verifies the parameters
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

DELETE('/api/user/delete/{id}', {msg: 'success'})

DELETE('/api/user/delete/{id}', (request, response) => {
  response.body = {msg: 'success'}
  return response
})
```
### PATCH
``` shell
import { PATCH } from 'xe-ajax-mock'

PATCH('/api/user/update', {msg: 'success'})
```
### JSONP
``` shell
import { JSONP } from 'xe-ajax-mock'

JSONP('http://xuliangzhan.com/jsonp/user/message', {msg: 'success'})

JSONP('http://xuliangzhan.com/jsonp/user/message', (request, response) => {
  response.body = {
    '!return|array(1-3)': {
      'id|number': '{{ $index+1 }}',
      'name': '{{ random.repeat("abcdefg",4,20) }}'
    }
  }
  return response
}， {jsonp: 'cb'})
```
### AMD
``` shell
define([
  'xe-ajax-mock'
], function (XEAjaxMock) {

  XEAjaxMock.GET('/api/user/list1', {msg: 'success'})
  XEAjaxMock.GET('/api/user/list2', function (request, response) {
    response.body = {
      '!return|array(1-3)': {
        'id|number': '{{ $index+1 }}',
        'name': '{{ random.repeat("abcdefg",4,20) }}'
      }
    }
    return response
  })

  // Support chain writing
  XEAjaxMock
  .GET('/api/user/list3', {msg: 'success'})
  .POST('/api/user/save1', function (request, response) {
    response.body = {msg: 'success'}
    return response
  })
  .POST('/api/user/save2', function (request, response) {
    return response.require('mock/json/api/user/save/data.json')
  })
})
```

## Functions of mixing
### ./customs.js
``` shell
import { POST } from 'xe-ajax-mock'

export function POST2 (path, options) {
  return POST(path, {message: 'success'}, options)
} 
```
### ./main.js
``` shell
import { Mock } from 'xe-ajax-mock'
import customs from './customs'

Mock.mixin(customs)

Mock.POST2('/api/user/save')
```

## Project Demos
[project examples.](https://github.com/xuliangzhan/examples)  

## License
Copyright (c) 2017-present, Xu Liangzhan