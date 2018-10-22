export interface XEAjaxMockOptions {
  baseURL?: string;
  template?: boolean;
  pathVariable?: string | boolean;
  timeout: string | number,
  headers?: string;
  error?: boolean;
  log?: boolean;
}

export interface XEAjaxMockMethods {
  version: string;

  /**
   * 允许用您自己的实用函数扩展到 XEAjaxMock
   * @param methods 扩展函数集
   */
  mixin(methods: object): void;

  /**
   * 
   * @param tmpl 编译的模板对象
   * @example 
    ```javascript
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
   */
  template(tmpl: any): Promise<any>;

  /**
   * 创建虚拟请求
   * @param path 请求路径
   * @param method 请求方法
   * @param response 响应结果
   * @param options 可选参数
   * @example 
    ```javascript
    Mock('/api/test/message/list', 'GET', [{id: 1, name: 'u1'}])
    Mock('/api/test/message/list', 'POST', {status: 1})
    ```
   */
  Mock(path: string, method: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 JSONP 类型请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 可选参数
   * @example 
    ```javascript
    JSONP('/api/test/message/list', [{id: 1, name: 'u1'}])
    ```
   */
  JSONP(path: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 GET 方法请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 可选参数
   * @example 
    ```javascript
    GET('/api/test/message/list', [{id: 1, name: 'u1'}])
    ```
   */
  GET(path: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 POST 方法请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 可选参数
   * @example 
    ```javascript
    POST('/api/test/message/list', {status: 1})
    ```
   */
  POST(path: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 PUT 方法请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 可选参数
   * @example 
    ```javascript
    PUT('/api/test/message/list', {status: 1})
    ```
   */
  PUT(path: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 DELETE 方法请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 
   * @example 
    ```javascript
    DELETE('/api/test/message/list', {status: 1})
    ```
   */
  DELETE(path: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 PATCH 方法请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 可选参数
   * @example 
    ```javascript
    PATCH('/api/test/message/list', null)
    ```
   */
  PATCH(path: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 HEAD 方法请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 可选参数
   * @example 
    ```javascript
    HEAD('/api/test/message/list', null)
    ```
   */
  HEAD(path: string, response: any, options?: object): Promise<any>;
}

/**
 * 基于 xe-ajax 的 Mock 虚拟服务
 * @example 
  ```javascript
  GET('/api/test/message/list', [{id: 1, name: 'u1'}])
  POST('/api/test/message/save', {status: 1})
  ```
 */
declare var XEAjaxMock: XEAjaxMockMethods;

export default XEAjaxMock;