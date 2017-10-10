//app.js
const config = require('config');
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs);

    // config.addata.imgUrls[0].url = "../../temp/3.jpg";
    //this.globalData.userInfo = null;

    // this.setAdData();
    
    // console.log(this.checkAdData())


    // this.getUserOpenId(function(err,openid){
    //   console.log(openid)
    // })


    // this.getUserData(function(err,userData){
      
    // })

    // this.getUserStorage(function(){},function(){});

    // var Url = config.requestUrl+ '/front/getConfig';
    // wx.request({
    //   url: Url,
    //   success: function(res) {
    //     // config.footdata.copyright = res.data.copyright;
    //     // config.footdata.phonemsg = "客服电话："+res.data.servicephone;
    //     // config.footdata.servicephone = res.data.servicephone;
    //     // config.navigationBarTitleText = res.data.titetext;
    //     console.log(Url,res);
    //     config.citys = res.data.citys;
    //   },
    //   fail:function(err){
    //     console.log(Url,err);
    //   }
    // })
    this.getConfig();
  },
  getConfig:function(cb){
      var Url = config.requestUrl+ '/front/getConfig';
      wx.request({
        url: Url,
        success: function(res) {
          // config.footdata.copyright = res.data.copyright;
          // config.footdata.phonemsg = "客服电话："+res.data.servicephone;
          // config.footdata.servicephone = res.data.servicephone;
          // config.navigationBarTitleText = res.data.titetext;
          console.log(Url,res);
          config.citys = res.data.citys;
          if(cb){
            cb();
          }
        },
        fail:function(err){
          console.log(Url,err);
        }
      })
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    openid:null,
    //正常数据{"openId":"xxx","unionId":"xxx"}
    userData:null 
  },
  //获取用户缓存信息
  getUserStorage:function(callback,userinfoCallback){
    var self = this;
    
    var v_userData = wx.getStorageSync('UserData');
    var v_userInfo = wx.getStorageSync('UserInfo');
    wx.checkSession({
      success: function(){
        if (v_userData && v_userInfo) {
            console.log("使用缓存数据",v_userData);
            self.globalData.userData = v_userData;
            self.globalData.userInfo = v_userInfo;
            callback(null,self.globalData.userData);
            userinfoCallback(null,self.globalData.userInfo);
        }else{
          self.getUserData(callback,userinfoCallback);
        }
      },
      fail: function(){
        
        self.getUserData(callback,userinfoCallback);
      }
    })
  },
  //获取用户完整信息 openId、unionId
  getUserData:function(callback,userinfoCallback){
    var self = this;
    wx.login({
      success: function(data) {
        console.log(data)
        wx.getUserInfo({
          success: function (res) {
            self.globalData.userInfo = res.userInfo;
            wx.setStorage({
              key:"UserInfo",
              data:res.userInfo
            })
            typeof userinfoCallback == "function" && userinfoCallback(null,self.globalData.userInfo)
            wx.request({
              url: config.userDataUrl,
              method:"POST",
              data: {
                code: data.code,
                encryptedData:res.encryptedData,
                iv:res.iv
              },
              success: function(res) {
                console.log(config.userDataUrl, res);
                if(res.statusCode == 200){
                  if(res.data.errcode == undefined){
                    self.globalData.userData = res;
                    wx.setStorage({
                      key:"UserData",
                      data:res
                    })
                    callback(null, self.globalData.userData);
                  }else{
                    callback(res)
                  }
                }else{
                  callback(res)
                }
              },
              fail: function(res) {
                console.log(config.userDataUrl, res);
                wx.removeStorage({
                  key: 'UserData'
                })
                callback(res);

              }
            })
          },
          fail:function(err){
            console.log('wx.getUserInfo 接口调用失败，将无法正常使用开放接口等服务', err)
            userinfoCallback(err)
          }
        })
      },
      fail: function(err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
        userinfoCallback(err)
      }
    })

  },
  // lazy loading openid
  getUserOpenId: function(callback) {
    var self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function(data) {
          wx.request({
            url: config.openIdUrl,
            data: {
              code: data.code
            },
            success: function(res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail: function(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail: function(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },
  //获取平台用户信息
  queryUserInfo:function(callback){
    var self = this;
    var userinfo = config.userInfo;
    var Url = config.requestUrl+ '/front/user/queryUserInfo';
    wx.request({
        url: Url,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          sessionId:self.globalData.userData.data.sessionId
        },
        success: function(res) {
            console.log(Url,res);
            if(res.data.status == "0"){
              userinfo.expiredDate = res.data.expiredDate;
              userinfo.count = res.data.count;
              userinfo.carNums = res.data.carNums;
              userinfo.mobile = res.data.mobile;
              if(userinfo.mobile != ""){
                userinfo.mobile = userinfo.mobile.substring(0,3)+"****"+userinfo.mobile.substring(7,11);
              }
              config.mobile = res.data.mobile;
              config.carNums = res.data.carNums;
              config.cityId = res.data.cityId;
              userinfo.userType = res.data.level;
              if(userinfo.expiredDate.length >= 10){
                userinfo.year = userinfo.expiredDate.substring(0,4);
                userinfo.month = userinfo.expiredDate.substring(5,7);
                userinfo.day = userinfo.expiredDate.substring(8,10);
                userinfo.text = "限南京 "+userinfo.year+"年"+userinfo.month+"月"+userinfo.day+"日到期";
              }
              callback();
            }
        },
        fail:function(err){
            console.log(Url,err);
        }
      })
  },

  tapTell:function(...option){
    console.log(option)
    wx.makePhoneCall({
      phoneNumber: config.footdata.servicephone
    })
  },
  request:function(url,data){
    var d = data || {};
    wx.request({
      url: url,
      data:d,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        console.log(url,res)
      }
    })
  },
  pay:function(parms,success,error){
    var self = this;
    wx.request({
          url: config.paymentUrl,
          header: {
              'content-type': 'application/x-www-form-urlencoded'
          },
          data: parms,
          method: 'POST',
          success: function(res) {
              var payargs = res.data;
              console.log("接口返回参数",res);
              var orderId = payargs.orderId;
              var parms = {
              appId:payargs.appId,
              timeStamp: payargs.timeStamp.toString(),
              nonceStr: payargs.nonceStr,
              package: payargs.package,
              signType:payargs.signType, //payargs.signType,
              paySign:payargs.paySign, //payargs.paySign,
              'success':function(res){
                  console.log("支付成功",res);
                  //支付成功后通知服务端
                  self.request(config.payCallbackUrl,{sessionId:self.globalData.userData.data.sessionId,orderId:orderId,package: payargs.package});
                  success(res);
              },
              'fail':function(res){
                  console.log("支付失败",res);
                  if(typeof(error) == "function"){
                    error();
                  }
                  
              }
              };
              console.log("签名参数",parms);
              wx.requestPayment(parms)
          }
      })
  }
})




// var self = this;
// var Url = config.requestUrl+ '/front/user/prepayInfo';
// wx.request({
//     url: Url,
//     data:{
//         sessionId:app.globalData.userData.data.sessionId,
//         deviceId:deviceId
//     },
//     header: {
//         'content-type': 'application/x-www-form-urlencoded'
//     },
//     method: 'POST',
//     success: function(res) {
//         console.log(Url,res)
//     }
// })