import { Base } from '../../utils/base.js';

class Order extends Base {

  /**
   * 
   */
  constructor() {
    super();
    this._storageKeyName = 'newOrder';
  }

  /**
   * 下订单
   */
  doOrder(param, callbace) {
    // 设置指针
    var that = this;
    // 设置参数
    var allParams = {
      url: 'order',
      type: 'post',
      data: { products: param },
      sCallback: function (res) {
        that.execSetStorageSync(true);
        callbace && callbace(res);
      },
      eCallback: function () {

      }
    };
    //发起请求
    this.request(allParams);
  }

  /**
   * 拉起微信支付（后端更新后修改）
   */
  execPay(orderNumber, callback) {
    var allParams = {
      url: 'pay/pre_order',
      type: 'post',
      data: { id: orderNumber },
      sCallback: function (res) {
        // 接口异常
        if (res.hasOwnProperty(data) && res.data.timeStamp) {
          // 接口正常
          var data = res.data
          wx.requestPayment({
            timeStamp: timeStamp.toString(),
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: function () {
              callback && callback(0); // 发起支付，并支付成功
            },
            fail: function () {
              callback && callback(1); // 发起支付，但失败或者取消
            }
          });
        } else {
          callback && callback(2); // 异常导致的订单无法支付
        }
      }
    }
    this.request(allParams);
  }



  /**
   * 本地缓存
   */
  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data);
  }

  /*获得订单的具体内容*/
  getOrderInfoById(id, callback) {
    var allParams = {
      url: 'order/' + id,
      type: 'post',
      data: {},
      sCallback: function (res) {
        callback && callback(res);
      },
      eCallback: function () {

      }
    };
    this.request(allParams);
  }

  /**
   * 获取订单列表
   */
  getOrders(page, listRows, callback) {
    var allParams = {
      url: 'order/by_user',
      type: 'GET',
      data: {
        page: page,
        listRows: listRows
      },
      sCallback: function (res) {
        callback && callback(res);
      },
      eCallback: function () {

      }
    };
    this.request(allParams);
  }

  /**
   * 是否有新订单
   */
  hasNewOrder() {
    var flag = wx.getStorageSync(this._storageKeyName);
    return flag == true;
  }



}

export { Order };