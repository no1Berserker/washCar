var app = getApp();
const config = require('../../config');
const cvas = require('../../utils/cvas');
const toast = require('../../utils/toast');
//页面数据
var pagedata = {
    "provalue":40,
    "number":"苏A 888888",
    "protxt":"请等待上一位车主完成洗车。",
    "price":20,
    "washcount":0
}
var payData ={
    "payType":0,//支付形式
    "payTitle":"",//支付标题文字
    "payTxt":"",//支付文字
    "cityId":"",
    "carNo":"",
    "pay":{
        "packageId":"",
        "price":0,
        "isFirst":false,
        "times":0,
        "hasRecharge":false
    }
}
var socketData = {
    waitCar:{
        carid:"",
        carNo:"",
        hasCar:true
    },
    validPay:true,
    waitStatus:0//0默认 非0跳转首页
}
var pageHide = 0;
var deviceId = ""; 
var tapPayBool = true;
var tapCusPayBool = true;
Page({
    onLoad: function (options) {
        var self = this;
        deviceId = options.deviceId || "";

        // toast.txtToast({show:true,txt:"网络错误",self:this});
        
        // toast.imgToast({txt:"发送成功",type:1,self:self,callback:function(){
        //     console.log("going")
        // }});
    },
    onUnload:function(){
        // console.log("xx")
        pageHide = 1;
        wx.closeSocket();
    },
    onHide:function(){
        // console.log("yy")
        pageHide = 1;
        //关闭webSocket
        wx.closeSocket();
    },
    onShow:function(){
        var self = this;
        pageHide = 0;
        app.getUserStorage(function(err,userData){
            self.loadData();
            
        },function(err,userinfo){
            if(err != null){//未授权用户
                wx.redirectTo({
                  url: '../index/index'
                })
            }
        });
    },
    data:{
        footdata:config.footdata,
        pagedata:pagedata,
        payData:payData
    },
    loadData:function(){
        var self = this;
        var Url = config.requestUrl+ '/front/pay/prepayInfo';
        wx.request({
            url: Url,
            data:{
                sessionId:app.globalData.userData.data.sessionId,
                deviceId:deviceId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function(res) {
                console.log(Url,res);
                payData = res.data;
                var a = self.getText();


                self.setData({
                    payData:payData,
                    validPay:socketData.validPay
                })
                console.log(payData);
                self.loadSocket();
            }
        })
    },
    loadSocket:function(){
        var self = this;
        //建立webSocket
        let Url = config.webSocketUrl + "?method=prepay&sessionId="+app.globalData.userData.data.sessionId+"&deviceId="+deviceId;
        wx.connectSocket({
          url: Url,
          data:{
            
          },
          header:{ 
            'content-type': 'application/x-www-form-urlencoded'
          },
          method:"GET"
        })
        wx.onSocketOpen(function(res) {
          console.log('WebSocket连接已打开！',Url)
        //   wx.sendSocketMessage({
        //     data:"发送消息",
        //     success:function(){
        //       console.log('WebSocket消息发送成功！')
        //     },
        //     fail:function(){
        //       console.log('WebSocket消息发送失败！')
        //     }
        //   })
            wx.onSocketMessage(function(res) {
                socketData = JSON.parse(res.data);
                console.log('收到服务器内容_prepay：'+new Date() ,socketData);
                self.setSocketData();
            })
        });
        wx.onSocketError(function(res){
          console.log('WebSocket连接打开失败，请检查！')
        })
        wx.onSocketClose(function(res) {
            if(pageHide == 0){
                console.log('WebSocket 非正常关闭！,5秒后重新建立连接'+new Date(),res);
                setTimeout(function(){
                    self.loadSocket();
                },5000)
            }else{
                console.log('WebSocket 已关闭！');
            }
        })

        // self.setSocketData();
        
    },
    setSocketData:function(){
        var self = this;
        if(!socketData.waitCar.hasCar){
            wx.redirectTo({
                url: '../index/index'
            })
        }
        if(socketData.waitStatus != 0){
            wx.redirectTo({
                url: '../index/index'
            })
        }
        if(socketData.validPay){
            payData.carNo = socketData.waitCar.carNo;
            var a = self.getText();
            self.setData({
                payData:payData,
                validPay:socketData.validPay
            })
        }else{
            payData.carNo = "";
            payData.payTitle = "排队中，请稍后再付款洗车 ^_^";
            self.setData({
                payData:payData,
                validPay:socketData.validPay
            })
        }
    },
    //获取提示文字
    getText:function(){
        let textList = [
            "欢迎首次体验大黄蜂洗车服务，请付款洗车 ^_^",
            "车牌识别失败，如果您是排在首位的车主，请付款洗车 ^_^",
            "请使用账户支付洗车 ^_^",
            "车牌识别失败，如果您是排在首位的车主，请使用账户支付洗车^_^",
            "剩余洗车次数不足，请充值或直接付款洗车^_^",
            "车牌识别失败，如果您是排在首位的车主，请充值或直接付款洗车^_^",
            "请付款洗车^_^",
            "车牌识别失败，如果您是排在首位的车主，请付款洗车^_^"
        ]
        let idx = 0;
        let payTxt = "";
        if(payData.pay.isFirst){
            if(payData.carNo != ""){
                idx = 0;//新用户（识别到车牌）
                payTxt = "￥"+payData.pay.price;
            }else{
                idx = 1;//新用户（未识别到车牌）
                payTxt = "￥"+payData.pay.price;
            }
        }else{
            if(payData.pay.hasRecharge){
                if(payData.pay.times > 0){
                    if(payData.carNo != ""){
                        idx = 2;//老用户，有剩余次数（识别到新车牌）
                        payTxt = "剩余："+payData.pay.times+"次";
                    }else{
                        idx = 3;//老用户，有剩余次数（未识别到车牌）
                        payTxt = "剩余："+payData.pay.times+"次";
                    }
                }else{
                    if(payData.carNo != ""){
                        idx = 4;//老用户，购买过套餐且已用尽（识别到车牌）
                        payTxt = "剩余："+payData.pay.times+"次";
                    }else{
                        idx = 5;//老用户，购买过套餐且已用尽（未识别到车牌）
                        payTxt = "剩余："+payData.pay.times+"次";
                    }
                }
            }else{
                if(payData.carNo != ""){
                    idx = 6;//老用户，未购买过套餐（识别到车牌）
                    payTxt = "￥"+payData.pay.price;
                }else{
                    idx = 7;//老用户，未购买过套餐（未识别到车牌）
                    payTxt = "￥"+payData.pay.price;
                }
            }
            
        }
        let s = textList[idx].replace(/{carNo}/ig,payData.carNo);
        payData.payTitle = s;
        payData.payType = idx;
        payData.payTxt = payTxt;
        return [s,idx,payTxt];
    },
    //微信支付事件
    tapPay:function(){
        if(!socketData.validPay){
            console.log("暂时不能支付!")
            return;
        };
        var self = this;
        if(!tapPayBool){
            toast.txtToast({txt:"正在支付中，请稍后",self:self});
            return;
        }
        tapPayBool = false;
        var parms ={
                sessionId:app.globalData.userData.data.sessionId,
                packageId:payData.pay.packageId,
                deviceId:deviceId,
                shopId:"",
                carid:socketData.waitCar.carid
            }
        app.pay(parms,function(){
            console.log("充值成功");
            tapPayBool=true;
            wx.redirectTo({
                url: '../index/index'
            })
        },function(){
            tapPayBool = true;
        })


    },
    //本平台支付事件
    tapCusPay:function(e){
        var self = this;
        var form_id = e.detail.formId;
        var Url = config.requestUrl+ '/front/pay/card/single';
        if(!socketData.validPay){
            console.log("暂时不能支付!")
            return;
        }
        if(!tapCusPayBool){
            toast.txtToast({txt:"正在支付中，请稍后",self:self});
            return;
        }
        tapCusPayBool = false;
        wx.request({
            url: Url,
            data:{
                sessionId:app.globalData.userData.data.sessionId,
                deviceId:deviceId,
		payMethod:0,
                cityId:payData.cityId,
                carNo:payData.carNo,
                carid:socketData.waitCar.carid
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function(res) {
                console.log(Url,res);
                if(res.data.status == 1){
                    toast.txtToast({txt:"支付失败，请联系管理员",self:self});
                    tapCusPayBool = true;
                }else{
                    wx.redirectTo({
                        url: '../index/index'
                    })
                }
            },
            fail:function(res){
                console.log(Url+"失败",res);
                tapCusPayBool = true;
            }
        })
    },
    //充值事件
    tapRecharge:function(){
        wx.navigateTo({
            url:"../paystep3/paystep3"
        })
    },
    tapTell:function(e){
        app.tapTell(this,e);
    }
})