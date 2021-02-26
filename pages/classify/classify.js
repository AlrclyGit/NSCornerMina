import { Classify } from 'classify-model.js';
var classify = new Classify();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null, // 分类ID
    name: '', // 分类名称
    classifyInfo: {} // 分类商品目录
  },

  /**
   * 生命周期函数
   */
  onLoad: function (options) {
    // 获取ID和名称
    this.data.id = options.id;
    this.data.name = options.name;
    // 调用获取数据的方法
    this._lodatData();
  },

  /**
   * 生命周期函数
   */
  onReady: function () {
    // 修改导航栏标题
    wx.setNavigationBarTitle({
      title: this.data.name,
    });
  },

  /**
   * 加载初始化数据
   */
  _lodatData: function () {
    // 获取主题下的商品列表
    classify.getProductsData(this.data.id, (data) => {
      this.setData({
        classifyInfo: data
      });
    });
  },

  /**
   * 商品被点击时
   */
  onProductsItemTap: function (event) {
    // 获取当前商品ID
    var id = classify.getDataSet(event, 'id');
    // 跳转到商品详情页
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  }


})