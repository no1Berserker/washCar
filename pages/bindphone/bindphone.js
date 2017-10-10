var app = getApp();
const config = require('../../config');
const toast = require('../../utils/toast');
const phoneReg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
const codeReg = /\d{4}/;
var pageData = {
  userMobile:config.mobile,
  sendCodeTime:-1,
  sendCodeTxt:"发送验证码",
  btDisabled:true,
  paySkip: ''
}
var inputData={
  phone:"",
  oldPhone:"",
  code:""
}
var btDisabled = true;
var codeMsg={
  sendCodeTime:-1
}
var ToastData = {
  img:{
    show:false,
    rightImg:"../../image/right.png",
    errorImg:"../../image/error.png",
    type:0,//0错误 1正确
    txt:"发送成功",
    duration:3000//显示时长
  },
  txt:{
    show:false,
    txt:"错误文字!",
    duration:3000//显示时长
  }
} 
Page({
  data:{
    pageData:pageData,
    footdata:config.footdata,
    btDisabled:btDisabled,
    codeMsg:codeMsg
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    pageData.paySkip = options.paySkip;
    var self = this;
    if(pageData.userMobile != ""){
      wx.setNavigationBarTitle({
        title: '更换绑定'
      })
    }
    app.getUserStorage(function(err,userData){
      app.queryUserInfo(function(){
        pageData.userMobile = config.mobile;
        self.setData({
          pageData:pageData
        });
      });
    },function(err,userinfo){

    });



  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  tapSendCode:function(){
    // console.log(phoneReg.test(inputData.phone)); 
    // return;

    var that = this;
    var Interval = null;
if (pageData.userMobile != '') {
      var str = inputData.phone;
      var oldStr = inputData.oldPhone;
      if (str.length == 0 || oldStr.length == 0) {
        toast.txtToast({ txt: "请先输入手机号码", self: that });
        return;
      }

      else {
        if(pageData.userMobile!=oldStr){
          toast.txtToast({ txt: "原手机号码有误，请重新输入", self: that });
          return;
        }

        if (!isNaN(str) && str.length == 11) {

        }
        else {
          toast.txtToast({ txt: "新手机号码有误，请重新输入", self: that });
          return;
        }

      }
    }
    else {
      var str = inputData.phone;
      if (str.length == 0) {
        toast.txtToast({ txt: "请先输入手机号码", self: that });
        return;
      }
      if (!isNaN(str) && str.length == 11) {

      }
      else {
        toast.txtToast({ txt: "手机号码有误，请重新输入", self: that });
        return;
      }
    }	
    if(codeMsg.sendCodeTime == -1){
      Interval = null;
      codeMsg.sendCodeTime = config.codeTime;
      that.setData({
        codeMsg:codeMsg
      });
      that.sendCode();
      Interval = setInterval(function(){
        codeMsg.sendCodeTime= codeMsg.sendCodeTime -1;
        that.setData({
          codeMsg:codeMsg
        });
        if(codeMsg.sendCodeTime == 0){
          codeMsg.sendCodeTime = -1
          clearInterval(Interval);
          that.setData({
            codeMsg:codeMsg
          });
        }
        // console.log(codeMsg.sendCodeTime)
      },1000)
    }else{

    }
  },
  inputPhone:function(e){
    inputData.phone = e.detail.value;
    this.regInput();
  },
  inputOldPhone:function(e){
    inputData.oldPhone = e.detail.value;
    this.regInput();
  },
  inputCode:function(e){
    inputData.code = e.detail.value;
    this.regInput();
  },
  //发送验证码
  sendCode:function(){
    var self = this;
    var Url = config.requestUrl+ '/front/user/mobile/random';
    wx.request({
      url: Url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        sessionId:app.globalData.userData.data.sessionId,
        hisMobile:inputData.oldPhone,
        newMobile:inputData.phone
      },
      success: function(res) {
          console.log(Url,res);
          if(res.data.status == "0"){
            toast.imgToast({txt:"发送成功",type:1,self:self});
          }else{
            toast.imgToast({txt:"发送失败",type:0,self:self});
          }
          
      },
      fail:function(err){
          console.log("error",Url,err);
          toast.imgToast({txt:"发送失败",type:1,self:self});
      }
    })
  },
  tapAdd:function(){
    console.log(pageData)

    var self = this;
    var Url = config.requestUrl+ '/front/user/mobile/bind';

    if(!pageData.btDisabled){
      if(config.mobile != inputData.oldPhone){
        toast.txtToast({txt:"请输入正确的原手机号码。",self:self});
        return;
      }
      wx.request({
        url: Url,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          sessionId:app.globalData.userData.data.sessionId,
          hisMobile:inputData.oldPhone,
          newMobile:inputData.phone,
          random:inputData.code
        },
        success: function(res) {
            console.log(Url,res);
            if(res.data.status == "0"){
              config.mobile = inputData.phone;
              console.log(config.mobile)
              config.userInfo.mobile = config.mobile.substring(0,3)+"****"+config.mobile.substring(7,11);
              if (pageData.paySkip == 1) {
                wx.redirectTo({
                  url: "../paystep3/paystep3"
                })
              }
              wx.redirectTo({
                url:"../index/index"
              })
            }else{
              toast.txtToast({ txt: "验证码有误", self: self });
            }
            // toast.txtToast({txt:txt,self:this});
        },
        fail:function(err){
            console.log("error",Url,err);
            //toast.imgToast({txt:"发送失败",type:1,self:self});
        }
      })
    }




  },
  //验证表单完整性
  regInput:function(){
    var b = true;
    if(pageData.userMobile == ""){
      b = phoneReg.test(inputData.phone) &&  codeReg.test(inputData.code);
    }else{
      b = phoneReg.test(inputData.phone) && phoneReg.test(inputData.oldPhone) &&  codeReg.test(inputData.code);
    }
    pageData.btDisabled = !b;
    // console.log(pageData.btDisabled)
    btDisabled = pageData.btDisabled;
    this.setData({
      btDisabled:btDisabled
    })
  },
  tapTell:function(e){
    app.tapTell(this,e);
  }
})