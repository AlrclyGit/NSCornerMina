import { Base } from '../../utils/base.js';

class Product extends Base {

  /**
   * 调用父类初始化方法
   */
  constructor() {
    super();
  }

  /**
   * 获取商品详情
   */
  getDetailInfo(id, callback) {
    var params = {
      url: 'product/' + id,
      sCallback: function (data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
}

export { Product };

