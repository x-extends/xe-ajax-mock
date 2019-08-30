import XEAjax from 'xe-ajax'

export interface XEAjaxMockOptions {
  /**
   * 基础路径
   */
  baseURL?: string;
  /**
   * 是否允许数据模板自动编译
   */
  template?: boolean;
  /**
   * 是否启用路径参数类型自动解析
   */
  pathVariable?: string | boolean;
  /**
   * 设置请求响应的时间
   */
  timeout?: string | number;
  /**
   * 设置jsonp回调参数名称
   */
  jsonp?: string;
  /**
   * 设置响应头信息
   */
  headers?: string;
  /**
   * 控制台输出请求错误日志
   */
  error?: boolean;
  /**
   * 控制台输出请求请求日志
   */
  log?: boolean;
}

export interface XEAjaxMockMethods {
  install(xAjax: typeof XEAjax): void;

  /**
   * 允许用您自己的实用函数扩展到 XEAjaxMock
   * @param methods 函数集
   */
  mixin(methods: object): void;

  /**
   * 编译模板
   * @param tmpl 编译的模板对象
    ```
   */
  template(tmpl: any): Promise<any>;

  /**
   * 创建虚拟请求
   * @param path 请求路径
   * @param method 请求方法
   * @param response 响应结果
   * @param options 可选参数
   */
  Mock(path: string, method: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 JSONP 类型请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 可选参数
   */
  JSONP(path: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 GET 方法请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 可选参数
   */
  GET(path: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 POST 方法请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 可选参数
   */
  POST(path: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 PUT 方法请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 可选参数
   */
  PUT(path: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 DELETE 方法请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 
   */
  DELETE(path: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 PATCH 方法请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 可选参数
   */
  PATCH(path: string, response: any, options?: object): Promise<any>;

  /**
   * 创建 HEAD 方法请求
   * @param path 请求路径
   * @param response 响应结果
   * @param options 可选参数
   */
  HEAD(path: string, response: any, options?: object): Promise<any>;
}

/**
 * 基于 xe-ajax 的 Mock 虚拟服务
 */
declare var XEAjaxMock: XEAjaxMockMethods;

export default XEAjaxMock;