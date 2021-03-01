import { Cart } from '../cart/cart-model.js';
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 从缓存中读取购物车数据
    var cartData = cart.getCartDataFromLocal();
    // 计算商品数量、商品总价格、商品种类数量
    var cal = this._calcTotalAccountAndCounts(cartData);
    // 将数据渲染到页面
    this.setData({
      selectedCounts: cal.selectedCounts,// 商品数量
      selectedTypeCounts: cal.selectedTypeCounts,// 商品种类数量
      account: cal.account, // 商品价格
      cartData: cartData //缓存中购物车数据
    });
  },

  /**
   * 刷新购物车页面
   */
  _resetCartData: function () {
    // 计算商品数量、商品总价格、商品种类数量
    var newData = this._calcTotalAccountAndCounts(this.data.cartData);
    // 刷新购物车页面
    this.setData({
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      account: newData.account,
      cartData: this.data.cartData
    });
  },

  /**
   * 计算商品数量、商品总价格、商品种类数量
   */
  _calcTotalAccountAndCounts: function (data) {
    // 设置变量
    var account = 0; // 总价格
    var selectedCounts = 0; // 选中的商品个数
    var selectedTypeCounts = 0; // 品种类数量
    // 计算变量
    data.forEach(value => {
      if (value.selectStatus) { // 选中商品
        account += value.counts * Number(value.price); // 商品价格 = 商品数量 * 商品价格
        selectedCounts += value.counts; // 商品数量
        selectedTypeCounts++; // 商品种类数量
      }
    });
    // 返回变量
    return {
      account: account,// 商品价格
      selectedCounts: selectedCounts,// 商品数量
      selectedTypeCounts: selectedTypeCounts// 商品种类数量
    };
  },

  /**
   * 获取商品在购物车列表的索引
   */
  _getProductIndexByID: function (id) {
    var data = this.data.cartData;
    var rKey = null;
    data.forEach((element, key) => {
      if (element.id == id) {
        rKey = key;
      }
    });
    return rKey;
  },

  /**
   * 商品选中状态切换
   */
  toggleSelect: function (event) {
    var id = cart.getDataSet(event, 'id'); // 商品ID
    var status = cart.getDataSet(event, 'status'); // 商品状态
    var index = this._getProductIndexByID(id); // 获取商品在购物车列表的索引
    this.data.cartData[index].selectStatus = !status; //状态取反
    this._resetCartData(); //刷新页面数据
  },


  /**
   * 商品选中状态切换(全选/取消全选)
   */
  toggleSelectAll: function (event) {
    var status = cart.getDataSet(event, 'status') == 'true';
    var data = this.data.cartData;
    data.forEach((value, key) => {
      data[key].selectStatus = !status;
    });
    this._resetCartData();
  },

  /**
   * 加减商品数量
   */
  changeCounts: function (event) {
    // 获取
    var id = cart.getDataSet(event, 'id'); // 获取商品ID
    var type = cart.getDataSet(event, 'type'); // 获取运算类型
    var index = this._getProductIndexByID(id); // 获取商品在购物车列表的索引
    var counts = 1;
    // 更新缓存
    if (type == 'add') {
      cart.addCounts(id); // 缓存中对应商品+1
    } else {
      counts = -1;
      cart.cutCounts(id); // 缓存中对应商品-1
    }
    // 修改页面的购物车某商品数量
    this.data.cartData[index].counts += counts;
    // 刷新购物车页面
    this._resetCartData(); 
  },

  /**
   * 删除商品
   */
  delete: function (event) {
    var id = cart.getDataSet(event, 'id'); // 获取商品ID
    var index = this._getProductIndexByID(id);// 获取商品在购物车列表的索引
    this.data.cartData.splice(index, 1);// 删除页面上的商品
    this._resetCartData();// 刷新购物车页面
    cart.delete(id);// 删除缓存中对应的商品
  },

  /**
   * 跳转到订单页面，并标示来源为cart
   */
  submitOrder: function (event) {
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart',
    });
  },

})