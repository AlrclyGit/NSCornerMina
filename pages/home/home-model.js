import { Base } from '../../utils/base.js';

class Home extends Base {

  /**
   * 初始化，并调用父类的初始化函数
   */
  constructor() {
    super();
  }

  /**
   * 获取Banner数据
   */
  getBannerData(callback) {
    var params = {
      url: 'banner/1',
      sCallback: function (data) {
        callback && callback(data.items)
      }
    }
    this.request(params)
  }

  /**
   * 获取多个分类数据
   */
  getThemeData(callback) {
    var params = {
      url: 'theme?ids=1,2,3',
      sCallback: function (data) {
        callback && callback(data)
      }
    }
    this.request(params);
  }

  /**
   * 获取最新商品数据
   */
  getproductsData(callback) {
    var params = {
      url: 'product/recent',
      sCallback: function (data) {
        callback && callback(data)
      }
    }
    this.request(params);
  }

}

export { Home };

