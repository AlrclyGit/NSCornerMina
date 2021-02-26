import { Config } from '../utils/config.js';
import { Token } from './token.js';

class Base {

  /**
   * 构造方法
   */
  constructor() {
    this.baseRequestUrl = Config.restUrl;
  }

  /**
   * 通用请求方法
   */
  request(params, noRefetch) {
    // 设置指针
    var that = this;
    // 拼接完整请求连接
    var url = this.baseRequestUrl + params.url;
    // 默认使用Get请求
    if (!params.data) {
      params.type = 'GET';
    }
    // 发送请求
    wx.request({
      url: url, // 请求地址
      data: params.data, // 请求数据
      method: params.type, // 请求类型
      header: { // 头文件
        'content-type': 'application/json', // 指定格式
        'token': wx.getStorageSync('token') // 指定Token
      },
      // 处理返回结果
      success(res) {
        // 格式化状态码
        var code = res.statusCode.toString();
        // 获取状态码第一位
        var startChar = code.charAt(0);
        // 如果状态码为2XX格式，则直接返回
        if (startChar == '2') {
          params.sCallback && params.sCallback(res.data);
        } else {
          // 如果是401，则进行新的请求
          if (code == '401') {
            if (!noRefetch) {
              that._refetch(params);
            }
          }
          // 如果二次请求过一次，则直接返回
          if (noRefetch) {
            params.eCallback && params.eCallback(res.data);
          }
        }
      },
      // 处理错误结果
      fail(err) {
        console.log("Error");
      }
    });
  }

  /**
   * 当Token无效时，生成Token并再次请求。
   */
  _refetch(params) {
    // 创建Token对象
    var token = new Token();
    // 调用Token的生成Token方法
    token.verify(() => {
      this.request(params, true);
    });
  }

  /**
   * 获得元素上得绑定得值
   */
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  }

}

export { Base };