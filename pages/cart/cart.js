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
    var cartData = cart.getCartDataFromLocal();
    var cal = this._calcTotalAccountAndCounts(cartData);
    this.setData({
      selectedCounts: cal.selectedCounts,
      selectedTypeCounts: cal.selectedTypeCounts,
      account: cal.account,
      cartData: cartData
    });
  },

  /**
   * 
   */
  onHide: function () {
    cart.execSetStorageSync(this.data.cartData);
  },

  /**
   * 
   */
  _calcTotalAccountAndCounts: function (data) {
    // 
    var account = 0; // 总价格
    var selectedCounts = 0; // 选中的商品个数
    var selectedTypeCounts = 0; // 商品种类
    //
    data.forEach(value => {
      if (value.selectStatus) {
        account += value.counts * Number(value.price);
        selectedCounts += value.counts;
        selectedTypeCounts++;
      }
    });
    //
    return {
      selectedCounts: selectedCounts,
      selectedTypeCounts: selectedTypeCounts,
      account: account
    };
  },

  /**
   * 
   */
  toggleSelect: function (event) {
    var id = cart.getDataSet(event, 'id');
    var status = cart.getDataSet(event, 'status');
    var index = this._getProductIndexByID(id);
    this.data.cartData[index].selectStatus = !status;
    this._resetCartData();
  },

  /**
   * 
   */
  _resetCartData: function () {
    var newData = this._calcTotalAccountAndCounts(this.data.cartData);
    this.setData({
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      account: newData.account,
      cartData: this.data.cartData
    });
  },

  /**
   * 
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
   * 
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
   * 
   */
  changeCounts: function (event) {
    //
    var id = cart.getDataSet(event, 'id');
    var type = cart.getDataSet(event, 'type');
    var index = this._getProductIndexByID(id);
    var counts = 1;
    //
    if (type == 'add') {
      cart.addCounts(id);
    } else {
      counts = -1;
      cart.cutCounts(id);
    }
    //
    this.data.cartData[index].counts += counts;
    this._resetCartData();
  },

  /**
   * 
   */
  delete: function (event) {
    var id = cart.getDataSet(event, 'id');
    var index = this._getProductIndexByID(id);
    this.data.cartData.splice(index, 1);
    this._resetCartData();
    cart.delete(id);
  },
  
  /**
   * 
   */
  submitOrder:function(event){
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart',
    });
  }

})