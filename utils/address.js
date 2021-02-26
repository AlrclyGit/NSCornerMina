import { Base } from 'base.js';
import { Config } from 'config.js';

class Address extends Base {

  /**
   * 构造方法
   */
  constructor() {
    super();
  }

  /**
   * 从服务器获取用户地址
   */
  getAddress(callback) {
    // 设置指针
    var that = this;
    // 设置请求参数
    var param = {
      url: 'address',
      sCallback: function (res) {
        if (res.code == 0) {
          // 获取返回的数据
          var userAddressInfo = res.data.address

          // 对返回的后端数据进行整理
          userAddressInfo.totalDetail = that.setAddressInfo(userAddressInfo);
          // 返回
          callback && callback(true,userAddressInfo);
        }else{
          callback && callback(false);
        }
      }
    };
    // 发送请求
    this.request(param);
  }

  /**
   * 
   */
  setAddressInfo(res) {
    // 
    var province = res.provinceName; //省
    var city = res.cityName; //市
    var country = res.countyName; //区
    var detail = res.detailInfo; //详细
    // 拼接地址
    var totalDetail = city + country + detail;
    if (!this.isCenterCity(province)) { //是否为直辖市
      totalDetail = province + totalDetail;
    }
    // 返回
    return totalDetail;
  }

  /**
   * 是否为直辖市
   */
  isCenterCity(name) {
    var centerCitys = ['北京市', '天津市', '上海市', '重庆市'];
    var flag = centerCitys.indexOf(name) > 0;
    return flag;
  }

  /**
   * 提交地址信息
   */
  submitAddress(data, callback) {
    // 设置请求参数
    var param = {
      url: 'address',
      type: 'post',
      data: data,
      sCallback: function (res) {
        callback && callback(true, res);
      },
      eCallback: function (res) {
        callback && callback(false, res);
      }
    };
    // 发送请求
    this.request(param);
  }



}

export { Address };