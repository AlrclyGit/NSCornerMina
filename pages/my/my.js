import { Address } from '../../utils/address.js';
import { Order } from '../order/order-model.js';
import { My } from '../my/my-model.js';

var address = new Address();
var order = new Order();
var my = new My();

Page({

    /**
     * 初始化默认数据
     */
    data: {
        //
        userInfo: {
            avatarUrl: '../../imgs/icon/user@default.png',
            nickName: '未同步'
        },
        //
        page: 1,
        listRows: 2,
        //
        orderArr: [],
        isLoadedAll: false,
        //
        newView: true
    },

    /**
     * onLoad
     */
    onLoad: function () {
        this._loadData(); //从服务器获取用户头像
        this._getAddressInfo() //从服务器获取用户地址
    },


    /**
     * onShow
     */
    onShow: function () {
        var neweOrderFlag = order.hasNewOrder();
        var newView = this.data.newView;
        if (neweOrderFlag || newView) {
            this.refresh();
            this.data.newView = false;
        }
    },

    /**
     * onReachBottom
     */
    onReachBottom: function () {
        if (!this.data.isLoadedAll) {
            this.data.page++;
            this._getOrders();
        }
    },

    /**
     * 
     */
    refresh: function () {
        var that = this;
        this.data.orderArr = [];
        this._getOrders(() => {
            that.data.isLoadedAll = false;
            that.data.page = 1;
            order.execSetStorageSync(false);
        });
    },

    /**
     * 同步微信信息
     */
    userInfoHandler: function (e) {
        if (e.detail.errMsg == 'getUserInfo:ok') {
            // 同步到服务器
            my.updateUserInfo(e.detail);
            // 渲染到页面
            var userInfo = e.detail.userInfo;
            this.setData({
                userInfo: {
                    avatarUrl: userInfo.avatarUrl,
                    nickName: userInfo.nickName
                }
            });
        }
    },

    /**
     * 
     */
    showOrderDetailInfo: function (event) {
        var id = order.getDataSet(event, 'id');
        wx.navigateTo({
            url: '../order/order?from=order&id=' + id
        });
    },

    /**
     * 从服务器获取用户头像
     */
    _loadData: function () {
        // 获取服务器头像，空则为默认头像
        my.getUserInfo((res) => {
            var userInfo = res.data;
            if (res.code == 0) {
                this.setData({
                    userInfo: {
                        avatarUrl: userInfo.avatar_url,
                        nickName: userInfo.nick_name
                    }
                });
            }
        });
    },

    /**
     * 从服务器获取用户地址
     */
    _getAddressInfo() {
        address.getAddress((flag, addressInfo) => {
            if (flag) {
                this.setData({
                    addressInfo: addressInfo
                });
            }
        });
    },

    /**
     * 从服务器获取用户订单
     */
    _getOrders(callBack) {
        order.getOrders(this.data.page, this.data.listRows, (res) => {
            //
            var data = res.data.data;
            //
            if (data.length > 0) {
                this.data.orderArr.push.apply(this.data.orderArr, data);
                console.log(this.data.orderArr);
                this.setData({
                    orderArr: this.data.orderArr
                });
                callBack && callBack();
            } else {
                this.data.isLoadedAll = true;
            }
        });
    },

    /**
     * 
     */
    rePay: function (event) {
        var id = order.getDataSet(event, 'id');
        var index = order.getDataSet(event, 'index');
        this._execPay(id, index);
    },

    /**
     * 
     */
    _execPay: function (id, index) {
        var that = this;
        order.execPay(id, (statusCode) => {
            if (statusCode > 0) {
                var flag = statusCode == 2;
                if (flag) {
                    that.data.orderArr[index].status = 2;
                    that.detData({
                        orderArr: that.data.orderArr
                    });
                }
                wx.navigateTo({
                    url: '../pay-result/pay-result?id=' + id + '&flag' + flag + '&from=my'
                });
            } else {
                that.showTips('支付失败', '库存不足');
            }
        });
    },

    /** 
    * 通过微信控件获取用户地址信息，并更新到服务器
    */
   editAddress: function (event) {
     // 设置指针
     var that = this;
     // 调起微信的地址器具
     wx.chooseAddress({
       // 成功
       success: (res) => {
         // 设置绑定数据
         var addressInfo = {
           userName: res.userName, // 姓名
           telNumber: res.telNumber, // 电话
           totalDetail: address.setAddressInfo(res) // 地址
         }
         // 地址数据绑定
         this.setData({
           addressInfo: addressInfo
         });
         // 提交地址信息
         address.submitAddress(res, (flag, res) => {
           if (!flag) {
             that.showTips('操作提示', '地址信息跟新失败');
           }
         });
       },
     })
   },

    /**
     * 弹窗警告
     */
    showTips: function (title, content, flag) {
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
            success: function () {
                if (flag) {
                    wx.switchTab({
                        url: '/pages/my/my'
                    });
                }
            }
        })
    },


})