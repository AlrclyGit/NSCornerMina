import { Category } from 'category-model.js';
var categroy = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMenuIndex: 0,
    loadedData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadDat();
  },

  /**
   * 
   */
  _loadDat: function () {
    categroy.getCategoryType((categroyData) => {
      //
      this.setData({
        categoryTypeArr: categroyData,
      });
      //
      categroy.getProductsByCategory(categroyData[0].id, (data) => {
        //
        var dataObj = {
          procucts: data,
          topImgUrl: categroyData[0].img.url,
          title: categroyData[0].name
        };
        //
        this.setData({
          categoryProducts: dataObj,
        });
        //
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
   * 
   */
  changeCategory: function (event) {
    //
    var index = categroy.getDataSet(event, 'index');
    var id = categroy.getDataSet(event, 'id');
    //
    this.setData({
      currentMenuIndex: index
    });
    //
    if (this.isLoadeData(id)) {
      //
      categroy.getProductsByCategory(id, (data) => {
        //
        var dataObj = {
          procucts: data,
          topImgUrl: this.data.categoryTypeArr[index].img.url,
          title: this.data.categoryTypeArr[index].name
        };
        //
        this.setData({
          categoryProducts: dataObj
        });
        //
        this.data.loadedData[id] = dataObj;
      });
    }else{
      this.setData({
        categoryProducts: this.data.loadedData[id]
      });
    }

  },

  /**
   * 
   */
  onProductsItemTap: function (event) {
    var id = categroy.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})