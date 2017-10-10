//index.js
//获取应用实例
var app = getApp();
const config = require('../../config');
const cvas = require('../../utils/cvas');
const toast = require('../../utils/toast');
var addata = config.addata;
//首页洗车进度等信息
var prodata = {
  stopType:1,//停止状态1可以点击 0弹层中 2强制中 
  proshow:false,//是否显示进度弹层
  proshowfull:false,//是否是白色背景
  provalue:50,// -5未授权 -1表示故障 -2状态1已支付别人在洗车 -3状态2已支付等待闸门打开 -4状态3已支付闸门打开
  protext:"预计还需2分钟",
  steptext:"正在洗车中...",
  deviceId:"",//洗车点ID
  pay:false//是否跳转去支付页面
}
// var pageData = 
//   {
//     "mobile":"139****2232","cardNo":"苏A 888888","count":2,"addr":"地址","expiredDate":"2017-08-29","text":"将在2019年01月20日到期 限南京",carNums:2 
//   };

var pageData = config.userInfo;

var pageHide = 0;//

Page({
  data: {
    nickName: '',
    userInfoAvatar: '',
    greeting: ''
  },
  
  onLoad: function (options) {
     wx.setNavigationBarTitle({
       title: config.navigationBarTitleText
     })

    var that = this;
    wx.getUserInfo({
      success: function (res) {
        // success
        that.setData({
          nickName: res.userInfo.nickName,
          userInfoAvatar: res.userInfo.avatarUrl,
        })
        console.log(res.userInfo.nickName)
      }
    })

    var date=new Date();
    console.log(date);
    var hour=date.getHours();
    if(hour>=5 && hour <9){
      pageData.greeting="早上好"
    }
    else if (hour >= 9 && hour < 12) {
      pageData.greeting =  "上午好"
    }
    else if (hour ==12 ) {
      pageData.greeting = "中午好"
    }
    else if (hour >=13 && hour <18) {
      pageData.greeting = "下午好"
    }
    else if (hour >= 18 && hour <=23) {
      pageData.greeting = "晚上好"
    }
    else if (hour >= 0 && hour <4) {
      pageData.greeting = " 凌晨好"
    }


    // if(app.globalData.userInfo == null){
    //   app.getUserInfo(function(_d){
    //     that.setData({
    //       userInfo: _d
    //     });
    //   });
    // }
    //toast.txtToast({show:true,txt:"网络错误",self:this});

    // var that = this;
    // var i = 1;
    // this.interval = setInterval(
    //   function(){
    //     cvas.proBar(i,"canvas","red");
    //     if(i == 100){
    //       clearInterval(that.interval)
    //     }
    //     i = i +1;
    //   }
    //   , 100);
     


    // console.log(pageData);
  },
  onReady:function(){
    // console.log(window.devicePixelRatio)
  },
  loadSocket:function(){
    //还原数据
    prodata.proshow = false;
    prodata.provalue = 0;
    prodata.proshowfull=false;
    var self = this;
    self.setData({
      prodata:prodata
    });

    let Url = config.webSocketUrl + "?method=wash&sessionId="+app.globalData.userData.data.sessionId;
    console.log(Url)
    //建立webSocket
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
      console.log('WebSocket连接已打开！'+new Date(),Url)
      // wx.sendSocketMessage({
      //   data:"发送消息",
      //   success:function(){
      //     console.log('WebSocket消息发送成功！')
      //   },
      //   fail:function(){
      //     console.log('WebSocket消息发送失败！')
      //   }
      // })
      wx.onSocketMessage(function(res) {
          console.log('收到服务器内容_wash：' ,JSON.parse(res.data));
          var socketData = JSON.parse(res.data);
          if(socketData.pay){
              wx.redirectTo({
                  url: '../pay/pay?deviceId='+socketData.deviceId
              })
          }
          prodata.stopType = 1;
          prodata.proshowfull = false;
          prodata.deviceId = socketData.deviceId;
          if(socketData.waitStatus != 0){
            prodata.proshow = true;
          }else{
            prodata.proshow = false;
          }
          if(socketData.waitStatus == 1){
            prodata.proshowfull=true;
            prodata.provalue = -2;
          }
          if(socketData.waitStatus == 2){
            prodata.proshowfull=true;
            prodata.provalue = -3;
          }
          if(socketData.waitStatus == 3){
            prodata.proshowfull=true;
            prodata.provalue = -4;
          }
          if(socketData.waitStatus == 4){
            prodata.provalue = socketData.progress;
            prodata.protext = "预计还需"+socketData.waitTime+"分钟";
            //进度条
            cvas.proBar(100,"canvas2","#cccccc");
            cvas.proBar(prodata.provalue,"canvas","#09bb07");
          }
          if(socketData.waitStatus == 5){
            cvas.proBar(100,"canvas3","#e64340");
            prodata.provalue = -1;
          }
          self.setData({
            prodata:prodata
          });
      })

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
    wx.onSocketError(function(res){
      console.log('WebSocket连接打开失败，请检查！',Url)
    })
  },
  onUnload:function(){
      pageHide = 1;
      wx.closeSocket();
  },
  onHide:function(){
    pageHide = 1;
    //关闭webSocket
    wx.closeSocket();
  },
  onShow:function(){
    pageHide = 0;
    var self = this;
    this.loadData(function(){
      self.loadSocket();
    });
  },
  loadData:function(callback){
    // console.log(config.userInfo)
    this.setData({
      pageData: config.userInfo
    });
    var self = this;
    var Url = config.requestUrl+ '/front/user/queryUserInfo';
    app.getUserStorage(function(err,userData){
      if(err != null){
        toast.txtToast({txt:"获取用户信息异常，请授权等待后重试或联系管理员",self:self});
      }else{
        app.queryUserInfo(function(){
          self.setData({
            pageData:config.userInfo
          });
          callback();
        });
      }
    },function(err,userinfo){
        if(err != null){
          console.log("用户未授权!",err);
          prodata.proshow = true;
          prodata.provalue = -5;
        }
        self.setData({
          prodata:prodata,
          userInfo: userinfo
        });

    })

  },
  data:{
    footdata:config.footdata,
    addata:addata,
    hasUserInfo: false,
    userInfo:app.globalData.userInfo,
    prodata:prodata,
    pageData:pageData
  },
  tapPayStep:function(){
    if(pageData.count == 0){
      this.navigator('../paystep3/paystep3');
    }else{
      this.navigator('../paystep2/paystep2');
    }
  },
  tapCar:function(){
    this.navigator('../carmanagement/carmanagement');
  },
  tapPhone:function(){
    this.navigator('../bindphone/bindphone');
  },
  tapRecord:function(){
    this.navigator('../record/record?idx=1');
  },
  tapCarAdd:function(){
    this.navigator('../add/add');
  },
  //私有跳转方法，默认是打开新页面 跳转传入redirect; txt提示文字
  navigator:function(url,txt,type){
    var parms ={url:url}
    txt = txt || "获取用户信息异常，请授权等待后重试或联系管理员";
    if(app.globalData.userData == null){
      toast.txtToast({txt:txt,self:this});
    }else{
      if(type == "redirect"){
        wx.redirectTo(parms)
      }else{
        wx.navigateTo(parms)
      }
    }
  },
  tapTell:function(e){
    app.tapTell(this,e);
  },
  tapUserItem:function () {
    app.tapUserItem();
  },
  onShareAppMessage: function () {
    return {
      title: '大黄蜂洗车',
      path: '/pages/index/index',
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },
  tapStopMachine:function(){
    var self = this;
    if(prodata.stopType == 1){
      prodata.stopType = 0;
      self.setData({
        prodata:prodata
      });

    }
  },
  confirmPrimary:function(){
      var self = this;
      var _d = "{\"sessionId\":\""+app.globalData.userData.data.sessionId+"\",\"method\":\"stall\",\"deviceId\":\""+prodata.deviceId+"\"}"
      wx.sendSocketMessage({
        data:_d,
        success:function(){
          console.log('WebSocket消息发送成功！')
        },
        fail:function(){
          console.log('WebSocket消息发送失败！')
        }
      })
      prodata.stopType = 2;
      self.setData({
        prodata:prodata
      });
      setTimeout(function(){
        prodata.stopType = 1;
        self.setData({
          prodata:prodata
        });
      },5000)
  },
  confirmCancel:function(){
    var self = this;
    prodata.stopType = 1;
    self.setData({
      prodata:prodata
    });
  },
  // 优雅的授权处理
  openSetting: function () {
    var that = this
    wx.openSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          that.loadData(function () {
            that.loadSocket()
          })
        }
      }
    })
  }
})