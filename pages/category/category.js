import { Category } from 'category-model.js';
var categroy = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMenuIndex: 0,
    loadedData: {},
    categoryTypeArr: {}, // 分类信息 
    categoryProducts: {} // 分类下商品信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadDat(); // 加载初始化数据
  },

  /**
   * 加载初始化数据
   */
  _loadDat: function () {
    // 获取所有分类信息
    categroy.getCategoryType((categroyData) => {
      // 设置数据
      this.setData({
        categoryTypeArr: categroyData,
      });
      // 获取第一个分类ID，并获取分类商品信息
      categroy.getProductsByCategory(categroyData[0].id, (data) => {
        // 整理商品信息
        var dataObj = {
          procucts: data, // 分类下的商品信息
          topImgUrl: categroyData[0].img.url, // 分类图片
          title: categroyData[0].name // 分类名称
        };
        // 渲染到页面
        this.setData({
          categoryProducts: dataObj,
        });
        // 将当前商品信息保存到 loadeData 变量数组
        this.data.loadedData[categroyData[0].id] = dataObj;
      });
    });

  },

  /**
   * 
   */
  isLoadeData: function (index) {
    if (this.data.loadedData[index]) {
      return false;
    }
    return true;
  },

  /**
   * 点击分类
   */
  changeCategory: function (event) {
    // 获取点击分类的ID
    var id = categroy.getDataSet(event, 'id');
    var index = categroy.getDataSet(event, 'index');
    // 更新索引位置
    this.setData({
      currentMenuIndex: index
    });
    // 判断本地数组是否已经有对应数据
    if (this.data.loadedData[id]) {
      // 有数据，直接渲染
      this.setData({
        categoryProducts: this.data.loadedData[id]
      });
    } else {
      // 没有数据侧获取分类商品信息
      categroy.getProductsByCategory(id, (data) => {
        // 整理商品信息
        var dataObj = {
          procucts: data,
          topImgUrl: this.data.categoryTypeArr[index].img.url,
          title: this.data.categoryTypeArr[index].name
        };
        // 渲染到页面
        this.setData({
          categoryProducts: dataObj
        });
        console.log(this.data.loadedData)
        // 将当前商品信息保存到 loadeData 变量数组
        this.data.loadedData[id] = dataObj;
      });
    
    }

  },

  /**
   * 点击商品
   */
  onProductsItemTap: function (event) {
    var id = categroy.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

})