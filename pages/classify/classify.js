import { Classify } from 'classify-model.js';
var classify = new Classify();

Page({

  /**
   * 页面的初始数据
   */
  data: {

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


  onReady:function(){
    // 修改导航栏标题
    wx.setNavigationBarTitle({
      title: this.data.name,
    });
  },

  /**
   * 
   */
  _lodatData: function () {
    classify.getProductsData(this.data.id, (data) => {
      this.setData({
        classifyInfo: data
      });
    });
  },

  /**
   * 
   */
    /**
   * 
   */
  onProductsItemTap:function(event){
    var id = classify.getDataSet(event,'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  }


})