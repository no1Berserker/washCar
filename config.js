const host = "xc.jsbolang.cn";

var config = {

    // 下面的地址配合云端 Server 工作
    host,

    // 登录地址，用于建立会话
    loginUrl: `https://${host}/login`,

    // 测试的请求地址前缀，用于测试会话
    requestUrl: `https://`+host+`/washCar`,
    webSocketUrl:`wss://`+host+`/washCar/front/websocket`,
    userDataUrl:`https://`+host+`/washCar/weixin/login`,

    payCallbackUrl:`https://`+host+`/washCar/front/pay/payQuery`,
    // 用code换取openId
    openIdUrl: `https://`+host+`/washCar/weixin/queryOpenId`,

    // 测试的信道服务接口
    tunnelUrl: `https://${host}/tunnel`,

    // 生成支付订单的接口
    paymentUrl: `https://`+host+`/washCar/weixin/preOrder`,

    // 发送模板消息接口
    templateMessageUrl: `https://${host}/templateMessage`,

    // 上传文件接口
    uploadFileUrl: `https://${host}/upload`,

    // 下载示例图片接口
    downloadExampleUrl: `https://${host}/static/weapp.jpg`,

    // 底部数据
    footdata: {
        userItem:"用户条款",
        servicephone:"025-66778899",
        phonemsg:"客服电话：025-66778899",
        copyright:"Copyright  © jsbolang.cn",
        src:"../../image/phone.png"
    },
    //广告数据
    addata:{
        imgUrls: [
            {url:"../../temp/bg1.jpg",attr:"000"}
            // ,{url:"http://go.10086.cn/rd/go/dh/upload_images/201703/17/20170317083409467.jpg",attr:"000"},{url:"http://go.10086.cn/rd/go/dh/upload_images/201703/17/20170317093451913.jpg",attr:"000"},
        ],
        indicatorDots: false,
        autoplay: false,
        interval: 2000,
        duration: 500
    },
    citys:[
        
    ],
    cityId:"",
    //导航栏标题文字内容
    navigationBarTitleText:"大黄蜂洗车",
    //扫码后获取设备ID
    deviceId:"",
    //绑定车辆个数
    carNums:0,
    //用户手机号
    mobile:"",
    //验证码时间
    codeTime:59,
    userInfo:{"mobile":"","cardNo":"","count":0,"addr":"","expiredDate":"","text":"",carNums:0,"userType":"" },
    clone:function(obj){
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;
        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0; i < obj.length; ++i) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }


};

module.exports = config
