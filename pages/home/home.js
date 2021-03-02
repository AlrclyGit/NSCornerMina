
import { Home } from 'home-model.js';
var homeM = new Home();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerArr:{}, // Banner数据
    themeArr:{}, // 指定分类数据
    productsArr:{}, // 最新商品数据
  },

  /**
   * 页面监听加载
   */
  onLoad() {
    this._loadData(); // 获取页面数据
  },

  /**
   * 获取页面数据
   */
  _loadData() {

    // 获取Banner数据
    homeM.getBannerData((data) => {
      this.setData({
        'bannerArr': data
      });
    });

    // 获取指定分类数据
    homeM.getThemeData((data) => {
      this.setData({
        'themeArr': data
      });
    });

    // 获取最新商品数据
    homeM.getproductsData((data) => {
      this.setData({
        'productsArr': data
      });
    });

  },

  /**
   * 点击Banner图片
   */
  onProductsItemTap(event) {
    var id = homeM.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

  /**
   * 点击分类图片
   */
  onThemesItemTap(event) {
    var id = homeM.getDataSet(event, 'id');
    var name = homeM.getDataSet(event, 'name');
    wx.navigateTo({
      url: '../dissertation/dissertation?id=' + id + '&name=' + name,
    })
  },

  /**
   * 点击最新商品图片
   */
  onProductsItemTap(event) {
    var id = homeM.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  }

})


