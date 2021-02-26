import { Config } from 'config.js';

class Token {

  /**
   * 构造方法
   */
  constructor() {
    this.tokenUrl = Config.restUrl + 'token/user';
  }

  /**
   * 生成Token
   */
  verify(callBack) {
    // 设置指针
    var that = this;
    // 获取Code
    wx.login({
      success: function (res) {
        // 发送请求
        wx.request({
          url: that.tokenUrl,
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (res) {
            // 设置Token
            wx.setStorageSync('token', res.data.data);
            callBack && callBack(res.data.data);
          }
        });
      }
    });
  }

}

export { Token };