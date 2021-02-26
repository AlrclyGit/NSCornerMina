import { Base } from '../../utils/base.js';

class Category extends Base {

  /**
   * 
   */
  constructor() {
    super();
  }

  /**
   * 获取所有分类信息
   */
  getCategoryType(callback) {
    var params = {
      url: 'category/all',
      sCallback: function (data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

  /**
   * 获取分类商品信息
   */
  getProductsByCategory(id,callback) {
    var params = {
      url: 'product/by_category?id=' + id,
      sCallback: function (data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }


}

export { Category };

