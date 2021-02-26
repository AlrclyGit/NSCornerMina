import { Base } from '../../utils/base.js';

class Category extends Base {

  /**
   * 
   */
  constructor() {
    super();
  }

  /**
   * 
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
   * 
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

