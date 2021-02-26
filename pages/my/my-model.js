import { Base } from '../../utils/base.js'

class My extends Base {

    /**
     * 构造方法
     */
    constructor() {
        super();
    }

    /**
     * 获取用户数据
     */
    getUserInfo(callbace) {
        // 设置参数
        var allParams = {
            url: 'user_info',
            type: 'GET',
            sCallback: function (res) {
                callbace && callbace(res);
            },
            eCallback: function () {
                // 错误处理
            }
        };
        //发起请求
        this.request(allParams);
    }

    /**
     * 更新用户信息到服务器
     */
    updateUserInfo(wxUserInfo) {
        // 设置参数
        var allParams = {
            url: 'user_info',
            type: 'post',
            data: {
                rawData: wxUserInfo.rawData,
                signature: wxUserInfo.signature
            },
            sCallback: function () {
                callbace && callbace();
            },
            eCallback: function () {
                // 错误处理
            }
        };
        //发起请求
        this.request(allParams);
    }
}



export { My }