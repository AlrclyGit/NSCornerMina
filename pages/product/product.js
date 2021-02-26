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
    currentTabsIndex: 0 // Tab选择位置
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取商品ID
    this.data.id = options.id;
    // 加载初始化数据
    this._loadData();
  },

  /**
   * 获取商品的详情数据
   */
  _loadData: function () {
    // 获取商品详情
    product.getDetailInfo(this.data.id, (data) => {
      this.setData({
        cartTotalcCounts: cart.getCartTotalCounts(), // 计算购物车内商品总数量
        product: data
      });
    });
  },

  /**
   * 更新选择的购买数量
   */
  bindPickerChange: function (event) {
    // 弹出选择器，获取选择的值。
    var index = event.detail.value; 
    this.setData({
      productCounts: this.data.countsArray[index] // 通过下标选择对应状态
    });
  },

  /**
   * 更新Tab选中效果
   */
  onTabsItemTap: function (event) {
    // 获取当前选择的Tab下标
    var index = product.getDataSet(event, 'index');
    this.setData({
      currentTabsIndex: index
    });
  },

  /**
   * 向购物车添加商品
   */
  onAddingToCartTap: function (event) {
    // 添加商品和数量到购物车
    this.addToCart();
    // 计算购物车内商品总数量，并渲染到页面
    this.setData({
      cartTotalcCounts: cart.getCartTotalCounts(),
    });
  },

  /**
   * 添加商品和数量到购物车
   */
  addToCart: function () {
    // 生产一个有以下4个属性的商品
    var tempObj = {};
    var keys = ['id', 'name', 'main_img_url', 'price'];
    for (var key in this.data.product) {
      if (keys.indexOf(key) >= 0) {
        tempObj[key] = this.data.product[key];
      }
    }
    // 添加商品和数量到购物车
    cart.add(tempObj, this.data.productCounts);
  },

  /**
   * 跳转到购物车
   */
  onCartTap: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  }

})