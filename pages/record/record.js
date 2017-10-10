var app = getApp();
const config = require('../../config');
var pageData={
  idx:0,
  washRecord:[
    // {"carNo":"苏A888888","washStartTime":"2017-03-22 10:04:22","washEndTime":"2017-03-22 12:04:22","position":"南京"}
  ],
  payRecord:[
    // {"rechargeTime":"2017-03-22 10:04:22","packageId":"23123123","packageName":"套餐名称","orderId":"2222222","cityId":"210000","cityName":"南京"}
  ]
}
Page({
  data:{
    pageData:pageData,
    footdata:config.footdata
  },
  onLoad:function(options){
    // console.log(getCurrentPages())
    // console.log(options);
    pageData.idx =  0;
    pageData.washRecord = [];
    pageData.payRecord = [];
    var self = this;

    // app.getUserStorage(function(err,userData){
    //   self.setData({
    //     pageData:pageData
    //   })
    //   // self.loadData(pageData.idx);

    //   // self.loadData(0);
    //   // self.loadData(1);
    // },function(userinfo){

    // });

    self.setData({
      pageData:pageData
    })
    self.loadData(0);
    self.loadData(1);

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
  tapLab:function(e){
    pageData.idx = e.currentTarget.dataset.idx;
    this.setData({
      pageData:pageData
    })

    // this.loadData(pageData.idx);
  },
  swiperChange:function(e){
    pageData.idx = e.detail.current;
    this.setData({
      pageData:pageData
    })
  },
  tapTell:function(e){
      app.tapTell(this,e);
  },
  getTime:function(_time){
    let r = "";
    if(_time.length == 10){
      r = _time.substring(5,7)+"-"+_time.substring(8,10)+" "
    }else if(_time.length >= 10){
      r = _time.substring(5,7)+"-"+_time.substring(8,10)+" "+_time.substring(11,13)+":"+_time.substring(14,16);
    }
    return r;
  },
  loadData:function(idx){
    var self = this;
    var Url = config.requestUrl+ '/front/user/queryPayHis';
    if(idx == 0){
      Url = config.requestUrl+ '/front/user/queryWashHis';
      if(pageData.washRecord.length > 0){
        return;
      }
    }else{
      if(pageData.payRecord.length > 0){
        return;
      }
    }
    wx.request({
        url: Url,
        data:{
            sessionId:app.globalData.userData.data.sessionId,
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
            console.log(Url,res)
            if(idx == 0){
              pageData.washRecord = res.data;
            }else{
              pageData.payRecord = res.data;
            }
            pageData.washRecord = pageData.washRecord.map(function(item,index){
              item.timeText = self.getTime(item.washStartTime);
              return item;
            })
            pageData.payRecord = pageData.payRecord.map(function(item,index){
              item.timeText = self.getTime(item.rechargeTime);
              return item;
            })
            self.setData({
              pageData:pageData
            })
        }
    })
  }
})