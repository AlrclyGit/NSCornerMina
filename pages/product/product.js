import { Product } from 'product-model.js';
var product = new Product();

import { Cart } from '../cart/cart-model.js';
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null, // 商品ID
    countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], //可选数量
    productCounts: 1, // 选择的商品数量
    currentTabsIndex: 0 // Tab默认选择位置
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this._loadData();
  },

  /**
   * 获取商品的详情数据
   */
  _loadData: function () {
    product.getDetailInfo(this.data.id, (data) => {
      this.setData({
        cartTotalcCounts: cart.getCartTotalCounts(),
        product: data
      });
    });
  },

  /**
   * 更新选择的购买数量
   */
  bindPickerChange: function (event) {
    var index = event.detail.value;
    var selectedCount = this.data.countsArray[index];
    this.setData({
      productCounts: selectedCount
    });
  },

  /**
   * 更新Tab选中效果
   */
  onTabsItemTap: function (event) {
    var index = product.getDataSet(event, 'index');
    this.setData({
      currentTabsIndex: index
    });
  },

  /**
   * 向购物车添加商品
   */
  onAddingToCartTap: function (event) {
    this.addToCart();
    this.setData({
      cartTotalcCounts: cart.getCartTotalCounts(),
    });
  },

  /**
   * 添加数量到购物车
   */
  addToCart: function () {
    var tempObj = {};
    var keys = ['id', 'name', 'main_img_url', 'price'];
    for (var key in this.data.product) {
      if (keys.indexOf(key) >= 0) {
        tempObj[key] = this.data.product[key];
      }
    }
    cart.add(tempObj, this.data.productCounts);
  },

  /**
   * 
   */
  onCartTap: function () {
      wx.switchTab({
        url: '/pages/cart/cart',
      })
  }

})