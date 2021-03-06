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
        // 默认用户信息
        userInfo: {
            avatarUrl: '../../imgs/icon/user@default.png',
            nickName: '未同步'
        },
        // 当前页、每页加载条数
        page: 1,
        listRows: 2,
        // 订单数组
        orderArr: [],
        // 时候加载完所有数据
        isLoadedAll: false,
        // 第一加载标记
        newView: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        this._loadData(); //从服务器获取用户头像
        this._getAddressInfo() //从服务器获取用户地址
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var neweOrderFlag = order.hasNewOrder(); // 是否有新订单
        var newView = this.data.newView; // 是否第一次加载页面
        if (neweOrderFlag || newView) {
            this.refresh(); // 加载订单数据
            this.data.newView = false; // 第一次加载页面False
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.isLoadedAll) {
            this.data.page++;
            this._getOrders();
        }
    },


    /**
     * 从服务器获取用户头像
     */
    _loadData: function () {
        // 获取服务器头像，空则为默认头像
        my.getUserInfo((res) => {
            var userInfo = res.data;
            console.log(res);
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
     * 通过微信控件获取用户地址信息，并更新到服务器
     */
    editAddress: function (event) {
        // 设置指针
        var that = this;
        // 调起微信的地址
        wx.chooseAddress({
            // 成功
            success: (res) => {
                // 设置绑定数据
                var addressInfo = {
                    userName: res.userName, // 姓名
                    telNumber: res.telNumber, // 电话
                    totalDetail: address.setAddressInfo(res) // 拼接地址转换
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
     * 第一次加载订单数据
     */
    refresh: function () {
        var that = this;
        this.data.orderArr = [];
        this._getOrders(() => { // 从服务器获取用户订单 
            that.data.isLoadedAll = false; // 加载完所有数据标记
            that.data.page = 1; // 设置当前页面
            order.execSetStorageSync(false); // 新订单标记为False
        });
    },

    /**
     * 从服务器获取用户订单
     */
    _getOrders(callBack) {
        order.getOrders(this.data.page, this.data.listRows, (res) => {
            // 获取订单数据
            var data = res.data.data;
            // 如果有数据
            if (data.length > 0) {
                this.data.orderArr.push.apply(this.data.orderArr, data); // 更新页面数组
                this.setData({
                    orderArr: this.data.orderArr // 刷新页面
                });
                callBack && callBack();
            } else {
                this.data.isLoadedAll = true; // 加载完所有数据标记
            }
        });
    },

    /**
     * 跳转到订单详情页
     */
    showOrderDetailInfo: function (event) {
        var id = order.getDataSet(event, 'id');
        wx.navigateTo({
            url: '../order/order?from=order&id=' + id
        });
    },

    /**
     * 付款按钮点击事件的处理函数
     */
    rePay: function (event) {
        var id = order.getDataSet(event, 'id');
        var index = order.getDataSet(event, 'index');
        this._execPay(id, index);
    },

    /**
     * 调用付款接口 （后端更新后修改）
     */
    _execPay: function (id, index) {
        var that = this;
        // 拉起微信支付
        order.execPay(id, (statusCode) => {
            if (statusCode == 0) {
                // 成功
                that.data.orderArr[index].status = 2;
                that.detData({
                    orderArr: that.data.orderArr
                });
            } else if (statusCode == 1) {
                // 弹窗提示失败
                my.showTips('支付失败', '网络不佳');
            } else {
                // 落地页提示失败
                wx.navigateTo({
                    url: '../pay-result/pay-result?id=' + id + '&flag=' + false + '&from=my'
                });
            }
        });
    }

})