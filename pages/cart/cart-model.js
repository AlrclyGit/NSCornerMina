import { Base } from '../../utils/base.js';

class Cart extends Base {

  /**
   * 初始化
   */
  constructor() {
    super();
    this._storageKeyName = 'cart';
  }

  /**
   * 添加商品和数量到缓存
   */
  add(item, counts) {
    var cartData = this.getCartDataFromLocal();// 从缓存中读取购物车数据
    var isHasInfo = this._isHasThatOne(item.id, cartData); // 断某个商品是否已经被添加到购物车中，并且返回这个商品的数据及所在数组中的序号
    if (isHasInfo.index == -1) {// 不存在侧添加
      item.counts = counts;
      item.selectStatus = true;
      cartData.push(item);
    } else { // 已经存在数量+1
      cartData[isHasInfo.index].counts += counts;
    }
    wx.setStorageSync(this._storageKeyName, cartData);
  }

  /**
   * 从缓存中读取购物车数据
   * @flag 是否仅获取选中商品，True仅选中，False所有的
   */
  getCartDataFromLocal(flag) {
    // 获取本地指定Key的缓存
    var res = wx.getStorageSync(this._storageKeyName);
    // 如果缓存不存在，设置一个空的数组
    if (!res) {
      res = [];
    }
    // 是否仅获取选中商品
    if (flag) {
      var newRes = [];
      res.forEach((value) => {
        if (value.selectStatus) {
          newRes.push(value);
        }
      });
      res = newRes;
    }
    // 返回
    return res;
  }

  /**
   * 计算购物车内商品总数量
   * Flag True 考虑商品选择状态
   */
  getCartTotalCounts(flag) {
    var data = this.getCartDataFromLocal();
    var counts = 0;
    data.forEach(value => {
      if (flag) {
        if (value.selectStatus) {
          counts += value.counts;
        }
      } else {
        counts += value.counts;
      }
    });
    return counts;
  }

  /**
   * 判断某个商品是否已经被添加到购物车中，并且返回这个商品的数据及所在数组中的序号
   */
  _isHasThatOne(id, arr) {
    var item;
    var result = { index: -1 };
    for (let i = 0; i < arr.length; i++) {
      item = arr[i];
      if (item.id == id) {
        result = {
          index: i,
          data: item
        }
        break;
      }
    }
    return result;
  }

  /**
   * 改变商品数量
   */
  _changeCounts(id, counts) {
    var cartData = this.getCartDataFromLocal(); // 从缓存中读取购物车数据
    var hasInfo = this._isHasThatOne(id, cartData); // 判断某个商品是否已经被添加到购物车中，并且返回这个商品的数据及所在数组中的序号
    if (hasInfo.index != -1) { // 商品存在
      if (hasInfo.data.counts >= 1) { // 商品数量大于0
        cartData[hasInfo.index].counts += counts; // 修改购物车某商品数量
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData); // 将修改数据写入缓存
  }

  /*
   * 商品数量+1
   */
  addCounts(id) {
    this._changeCounts(id, 1);
  }
  /*
   * 商品数量-1
   */
  cutCounts(id) {
    this._changeCounts(id, -1);
  }

  /**
   * 删除缓存中的商品
   */
  delete(ids) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }
    var cartData = this.getCartDataFromLocal();
    ids.forEach((value) => {
      var hasInfo = this._isHasThatOne(value, cartData);
      if (hasInfo.index != -1) {
        cartData.splice(hasInfo.index, 1);
      }
    });
    wx.setStorageSync(this._storageKeyName, cartData);
  }


}

export { Cart };



