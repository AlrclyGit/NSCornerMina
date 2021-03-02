Page({

    data: {

    },

    /**
     * 页面加载-生命周期函数
     */
    onLoad: function (options) {
        this.setData({
            payResult: options.flag, // 支付状态
            id: options.id, // 订单ID
            from: options.from // 数据来源
        });
    },

    /**
     * 查看订单
     */
    viewOrder: function () {
        if (this.data.from == 'my') { // 来源为个人页，跳转到订单页
            wx.redirectTo({
                url: '../order/order?from=order&id=' + this.data.id
            });
        } else { // 其他来源则，返回上一级
            wx.navigateBack({
                delta: 1
            })
        }
    }
}
)