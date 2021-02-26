import { Cart } from '../cart/cart-model.js';
import { Order } from '../order/order-model.js';
import { Address } from '../../utils/address.js';

var cart = new Cart();
var order = new Order();
var address = new Address();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
    var from = options.from;
    //
    if (from == 'cart') {
      this._fromCart(options.account);
    } else if (from == 'order') {
      this._fromOrder(options.id)
    } else {
      console.log('来路不明');
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var id = this.data.id;
    if (id) {
      this._fromOrder(id);
    }
  },

  /**
   * 从购物车传递过来，本地获取订单详情
   */
  _fromCart: function (account) {
    // 获取传递过来的金额
    this.data.account = account;
    // 从缓存中读取购物车数据，获取仅选中的商品
    var productsArr = cart.getCartDataFromLocal(true);
    // 数据绑定
    this.setData({
      productsArr: productsArr, // 仅选中的商品信息
      account: account, // 传递过来的金额
      orderStatus: 0 // 订单状态
    });
    // 获取用户地址，地址数据绑定
    address.getAddress((flag, addressInfo) => {
      if (flag) {
        this.setData({
          addressInfo: addressInfo
        });
      }
    });
  },


  /**
   * 从订单列表传递过来，服务器获取订单详情
   */
  _fromOrder: function (id) {
    var that = this;
    //下单后，支付成功或者失败后，点左上角返回时能够更新订单状态 所以放在onshow中
    order.getOrderInfoById(id, (res) => {
      console.log(res);
      that.setData({
        orderStatus: res.status,
        productsArr: res.snap_items,
        account: res.total_price,
        basicInfo: {
          orderTime: res.created_at,
          orderNo: res.order_no
        },
      });
      // 快照地址
      var addressInfo = res.snap_address;
      addressInfo.totalDetail = address.setAddressInfo(addressInfo);
      this.setData({
        addressInfo: addressInfo
      });
    });

  },


  /**
   * 通过微信控件获取用户地址信息，并更新到服务器
   */
  editAddress: function (event) {
    // 设置指针
    var that = this;
    // 调起微信的地址器具
    wx.chooseAddress({
      // 成功
      success: (res) => {
        // 设置绑定数据
        var addressInfo = {
          userName: res.userName, // 姓名
          telNumber: res.telNumber, // 电话
          totalDetail: address.setAddressInfo(res) // 地址
        }
        // 地址数据绑定
        this.setData({
          addressInfo: addressInfo
        });
        // 提交地址信息
        address.submitAddress(res, (flag, res) => {
          if (!flag) {
            that.showTips('操作提示', '地址信息跟新失败');
          }
        });
      },
    })
  },


  /**
   * 点击「去付款」按钮
   */
  pay: function () {
    if (!this.data.addressInfo) { //如果地址未填写则弹出警告
      this.showTips('下单提示', '请填写您的收货地址');
      return;
    }
    if (this.data.orderStatus == 0) { //未生成订单的支付
      this._firstTimePay();
    } else { // 已生成订单的支付
      this._oneMoresTimePay();
    }
  },

  /**
   * 第一次支付
   */
  _firstTimePay: function () {
    // 设置变量
    var orderInfo = [];// 订单信息（ID和数量）
    var procuctInfo = this.data.productsArr;// 选中的商品信息
    var order = new Order(); // 生成一个订单对象
    // 设置订单的ID和数量
    procuctInfo.forEach((value) => {
      orderInfo.push({
        product_id: value.id,
        count: value.counts
      });
    });
    // 设置指针
    var that = this;
    // 支付分两步，第一步是生成订单号，然后根据订单号支付
    order.doOrder(orderInfo, (res) => {
      var data = res.data;
      // 订单生成成功
      if (data.pass) {
        // 更新订单状态
        var id = data.order_id;
        that.data.id = id;
        that.data.fromCartFlag = false;
        // 开始支付
        that._execPay(id);
      } else {
        that._orderFail(data);
      }
    });
  },

  /**
   * 开始支付
   */
  _execPay: function (id) {
    // 设置指针
    var that = this;
    // 拉起微信支付 
    order.execPay(id, (statusCode) => {
      if (statusCode != 0) {
        var flag = statusCode == 2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order',
        });
        that.deleteProducts();
      }
    });
  },

  /**
   * 下单失败弹窗
   */
  _orderFail: function (data) {
    //
    console.log('下单失败');
    //
    var nameArr = [];
    var name = '';
    var str = '';
    var pArr = data.pStatusArray;
    //
    for (var i = 0; i < pArr.length; i++) {
      if (!value.haveStock) {
        name = pArr[i].name;
        if (name.length > 15) {
          name = name.substr(0, 12) + '...';
        }
        nameArr.push(name);
        if (nameArr.length >= 2) {
          break;
        }
      }
    }
    str += nameArr.join('、');
    if (nameArr.length > 2) {
      str += ' 等';
    }
    str += ' 缺货';
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel: false,
      success: function (res) {

      }
    });
  },

  /**
   * 删除已经生成订单的商品
   */
  deleteProducts: function () {
    var ids = [];
    var arr = this.data.productsArr;
    arr.forEach((value) => {
      ids.push(value.id);
    });
    cart.delete(ids);
  },

  /**
   * 弹窗警告
   */
  showTips: function (title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function () {
        if (flag) {
          wx.switchTab({
            url: '/pages/my/my'
          });
        }
      }
    })
  },

})