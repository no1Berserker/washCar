var app = getApp();
const config = require('../../config');
const toast = require('../../utils/toast');
// var pageData = {
//   carList:[
//     {"no":"苏A 29183"}
//   ],
//   memoryCarList:[
//     {"no":"苏A kk181"},
//     {"no":"苏A kk182"},
//     {"no":"苏A kk183"},
//     {"no":"苏A kk184"},
//     {"no":"苏A kk185"},
//     {"no":"苏A kk186"}
//   ],
//   carNo:""
// }
var pageData = {
  carList:[],
  memoryCarList:[],
  carNo:"",
  packageId:0
}

// var carNoReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
// var carNoReg = /[\u4e00-\u9fa5][a-zA-Z](([DF](?![a-zA-Z0-9]*[IO])[0-9]{4})|([0-9]{5}[DF]))|^[冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新京军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5}[a-zA-Z0-9挂学警港澳]{1}$/;
var carNoReg = /[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z0-9]{6}|^[冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新京军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5}[a-zA-Z0-9挂学警港澳]{1}$/;
Page({
  data:{
    pageData:pageData,
    footdata:config.footdata,
    keyboardShow: false,
    keySwitch: 1
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    pageData.carList = [];
    pageData.memoryCarList = [];
    pageData.carNo = "";
    pageData.packageId = options.packageId || 0;
    if(pageData.carNums == 0 && pageData.packageId != 0){
      wx.setNavigationBarTitle({
        title: '添加车辆'
      })
    }
    var self = this;
    self.loadData();

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
  loadData:function(){
    var self = this;
    var Url = config.requestUrl+ '/front/user/car/query';
    wx.request({
      url: Url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        sessionId:app.globalData.userData.data.sessionId
      },
      success: function(res) {
          console.log(Url,res);
          if(res.data.carNos != null){
            pageData.carList = [];
            for(var i = 0;i<res.data.carNos.length;i++){
              pageData.carList.push({"no":res.data.carNos[i]})
            }
          }
          if(res.data.washCarNos != null){
            pageData.memoryCarList = [{ "no": "苏AKK181" },
              { "no": "苏AKK182" },
              { "no": "苏AKK183" },
              { "no": "苏AKK184" },
              { "no": "苏AKK185" },
              { "no": "苏AKK186" }];
            for(var i = 0;i<res.data.washCarNos.length;i++){
              pageData.memoryCarList.push({"no":res.data.washCarNos[i]})
            }
          }
          self.setData({
            pageData:pageData
          })
      },
      fail:function(err){
        console.log(Url,err);
      }
    })
  },
  addData:function(carNo){
    var self = this;
    var Url = config.requestUrl+ '/front/user/car/add';
    if(pageData.carList.findIndex(x => x.no == carNo) != -1) {
      toast.txtToast({txt:"此车已存在",self:self});
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
        carNo:carNo
      },
      success: function(res) {
        toast.txtToast({txt:"添加成功",self:self});
        
        pageData.carList.push({"no":carNo})
        pageData.carNo = "";
        self.setData({
          pageData:pageData
        })
        config.userInfo.carNums = pageData.carList.length;
        console.log(Url,res);
      },
      fail:function(err){
        console.log(Url,err);
      }
    })
  },
  insertCar:function(e){
    // pageData.carList.push();
    var idx = parseInt(e.currentTarget.dataset.idx);
    var no = pageData.memoryCarList[idx].no;
    // pageData.memoryCarList.splice(idx,1);
    this.addData(no);
  },
  // inputCarNo:function(e){
  //   pageData.carNo = e.detail.value;
  //   // console.log(pageData)
  //   // this.addData(pageData.carNo);
  // },
  inputCarNo1: function (e) {
    pageData.carNo = pageData.carNo + e.target.dataset.msg;
    if (pageData.carNo.length == 1) {
      this.setData({
        keySwitch: 0
      })
    }
    if (pageData.carNo.length > 8) {
      return;
    }
    this.setData({
      pageData: pageData
    })
  },
  stopPropagation: function () {

  },
  insertCar2: function(e) {
    var self = this;
    //pageData.carNo = pageData.carNo.toUpperCase();
    pageData.carNo = this.data.pageData.carNo;
    //console.log(pageData.carNo);
    if(carNoReg.test(pageData.carNo)){
      self.addData(pageData.carNo);
      self.setData({
        keySwitch: 1,
        keyboardShow: false,
        pageData: pageData
      })
    }else{
      toast.txtToast({txt:"请输入正确的车牌号",self:self});
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      if (config.userInfo.carNums == 0 || config.userInfo.mobile == '') {
        prevPage.setData({
          payPopupShow: true
        })
      }
    }
    // console.log(carNoReg.test(pageData.carNo))
    // pageData.carList.push({"no":pageData.carNo});
    // pageData.carNo = "";
    // this.setData({
    //   pageData:pageData
    // })
  },
  delCar:function(e){
    var self = this;
    var idx = parseInt(e.currentTarget.dataset.idx);
    var Url = config.requestUrl+ '/front/user/car/delete'
    wx.request({
      url: Url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        sessionId:app.globalData.userData.data.sessionId,
        carNo:pageData.carList[idx].no
      },
      success: function(res) {
        toast.txtToast({txt:"删除成功",self:self});
        
        pageData.carList.splice(idx,1);
        self.setData({
          pageData:pageData
        })
        config.userInfo.carNums = pageData.carList.length;
        console.log(Url,res);
      },
      fail:function(err){
        console.log(Url,err);
      }
    })


    // pageData.carList.splice(idx,1);
    // this.setData({
    //   pageData:pageData
    // })




  },
  tapPay:function(){
      var self = this;
      if(pageData.carList.length == 0){
        toast.txtToast({txt:"请绑定车牌后再支付",self:self});
        return;
      }
      var parms ={
              sessionId:app.globalData.userData.data.sessionId,
              packageId:pageData.packageId,
              deviceId:"",
              shopId:""
          }
      app.pay(parms,function(){
          console.log("充值成功")
          wx.redirectTo({
              url: '../index/index'
          })
      })
  },
  tapTell:function(e){
    app.tapTell(this,e);
  },
  keyboardShow: function () {
    var that = this
    this.setData({
      keySwitch: 1,
      keyboardShow: !that.data.keyboardShow
    })
  },
  keySwitch: function () {
    var keySwitch = this.data.keySwitch;
    var that = this;
    if (keySwitch == 1) {
      that.setData({
        keySwitch: 0
      })
    }
    if (keySwitch == 0) {
      that.setData({
        keySwitch: 1
      })
    }
  },
  keyDelete: function () {
    if (pageData.carNo.length == 1) {
      this.setData({
        keySwitch: 1
      })
    }
    var carNo = this.data.pageData.carNo.split('');
    carNo.pop();
    pageData.carNo = carNo.join('');
    if (pageData.carNo === undefined) {
      pageData.carNo = '';
    }
    this.setData({
      pageData: pageData
    })
  }
})