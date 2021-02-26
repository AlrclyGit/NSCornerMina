import { Base } from '../../utils/base.js';

class Motif extends Base {

  /**
   *  构造函数
   */
  constructor() {
    super();
  }

  /**
   * 获取主题下的商品列表
   */
  getProductsData(id, callback) {
    var param = {
      url: 'theme/' + id,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }

}

export { Motif }

