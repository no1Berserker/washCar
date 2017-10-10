var app = getApp();
const config = require('../../config');
const toast = require('../../utils/toast');
const provinces = [];
var cities = [];
// for (let i = 0; i < config.citydata.length; i++) {
//     provinces.push(config.citydata[i].name)
// }
// var v = [4,2];
// for (let i = 0; i < config.citydata[v[0]].cities.length; i++) {
//     cities.push(config.citydata[v[0]].cities[i])
// }

var tapPayBool = true;
var pageData ={
    // selectCityHide:false,//显示城市弹出窗是否隐藏
    // city:config.citydata[v[0]].cities[v[1]]//选择城市
    // city:cities[0]
    pickerIndex:0,
    cities:["南京","上海","北京"],
    modes:[
        // {id:"222",cost:280,baseCost:380,times:240,delay:"2",cityId:"2222",hover:false}
    ],
    payImg_1: '',
    payTxt_1: {},
    payImg_2: '',
    payTxt_2: {}
}
Page({
  data:{
    // provinces:provinces,
    // cities:cities,
    // cityvalue:v,
    pageData:pageData,
    footdata:config.footdata,
    payPopupShow: false
  },
  onLoad: function (options) {
    // wx.getLocation({
    // type: 'gcj02',
    // success: function(res) {
    //         console.log(res)
    //     }
    // })
    // console.log(config.citydata[0].name);
    // console.log(pageData);

    // pageData.selectCityHide = true;
    // this.setData({
    //     pageData: pageData
    // });
    var self = this;
    // this.setData({
    //     pageData: pageData
    // });
    app.getUserStorage(function (err, userData) {
      if (config.citys.length == 0) {
        app.getConfig(function () {
          self.loadData();
        })
      } else {
        self.loadData();
      }
    }, function (err, userinfo) {

    });

    // this.loadData();
  },
  onShow: function () {
    
  },
  loadData:function(){
    var self = this;
    pageData.cities = [];
    for(let i in config.citys){
      pageData.cities.push(config.citys[i].name);
    }
    var Url = config.requestUrl+ '/front/pay/package';
    let cityId = "210000";
    if(config.citys.find(x=>x.name=="南京")){
      cityId = config.citys.find(x=>x.name=="南京").id;
    }
    wx.request({
      url: Url,
      data:{
          sessionId:app.globalData.userData.data.sessionId,
          cityId:cityId
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        console.log(Url,res);
        pageData.modes = res.data;
        self.setData({
            pageData: pageData
        });
      }
  })


    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function(res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     var speed = res.speed
    //     var accuracy = res.accuracy
    //     console.log(res)
    //   },
    //   fail:function(e){
    //     console.log(e)
    //   }
    // })
  },
  bindPickerChange:function(e){
    pageData.pickerIndex = e.detail.value
    this.setData({
        pageData: pageData
    });
  },
  bindTapMode: function (e) {
    // console.log(e.currentTarget.dataset)
    this.loadData();
    var self = this;
    this.checkInfo();
    if (config.userInfo.mobile == '' || config.userInfo.carNums == 0) {
      self.setData({
        payPopupShow: true
      })
      return;
    }

    // if (config.userInfo.carNums == 0){
    //   wx.redirectTo({
    //      url: '../carmanagement/carmanagement?packageId='+e.currentTarget.dataset.id
    //   })
    //   return;
    // }
    
    if(!tapPayBool){
      toast.txtToast({txt:"正在支付中，请稍后",self:self});
      return;
    }
    tapPayBool = false;

    pageData.modes = pageData.modes.map(function(item,index){
      if(e.currentTarget.dataset.idx == index){
          item.hover = true;
      }else{
          item.hover = false;
      }
      return item;  
    });
    this.setData({
      pageData: pageData
    });

    var parms ={
      sessionId:app.globalData.userData.data.sessionId,
      packageId:e.currentTarget.dataset.id,
      deviceId:"",
      shopId:""
    }
    app.pay(parms,function(){
      console.log("充值成功");
      tapPayBool = true;
      wx.redirectTo({
          url: '../index/index'
      })
    },function(){
      tapPayBool = true;
    })

  },
  tapTell:function(e){
    app.tapTell(this,e);
  },
  toBindph: function () {
    if (config.userInfo.mobile == '') {
      this.setData({
        payPopupShow: false
      })
      wx.navigateTo({
        url: '../bindphone/bindphone?paySkip=1'
      })
    }
  },
  toBindcar: function () {
    if (config.userInfo.carNums == '') {
      this.setData({
        payPopupShow: false
      })
      wx.navigateTo({
        url: '../carmanagement/carmanagement'
      })
    }
  },
  checkInfo: function () {
    var self = this
    if (config.userInfo.mobile == '') {
      pageData.payImg_1 = '../../image/bindphno.png';
      pageData.payTxt_1.txt = '未绑定手机号';
      pageData.payTxt_1.sty = '';
      self.setData({
        pageData: pageData
      })
    } else {
      pageData.payImg_1 = '../../image/bindph.png';
      pageData.payTxt_1.txt = '已绑定手机号';
      pageData.payTxt_1.sty = 'h';
      self.setData({
        pageData: pageData
      })
    }

    if (config.userInfo.carNums == 0) {
      pageData.payImg_2 = '../../image/bindcarno.png';
      pageData.payTxt_2.txt = '未绑定车牌号';
      pageData.payTxt_2.sty = '';
      self.setData({
        pageData: pageData
      })
    } else {
      pageData.payImg_2 = '../../image/bindcar.png';
      pageData.payTxt_2.txt = '已绑定车牌号';
      pageData.payTxt_2.sty = 'h';
      self.setData({
        pageData: pageData
      })
    }
  },
  payPopupShow:function () {
    this.setData({
      payPopupShow: !this.data.payPopupShow
    })
  },
  stopPropagation:function () {
    
  }

  // selectCity:function(e){
  //     if(pageData.selectCityHide){
  //         pageData.city = config.citydata[v[0]].cities[v[1]];
  //     }
  //     pageData.selectCityHide = !pageData.selectCityHide;
  //     this.setData({
  //         pageData: pageData,
  //         cityvalue:v
  //     });
  // },
  // cityChange: function(e) {
  //     const val = e.detail.value;
  //     if(val[0] != v[0]){
  //         cities = [];
  //         v[1] = 0;
  //         v[0] = val[0];
  //         for (let i = 0; i < config.citydata[val[0]].cities.length; i++) {
  //             cities.push(config.citydata[val[0]].cities[i])
  //         }
  //         this.setData({
  //             cities: cities,
  //             cityvalue:v
  //         });
  //     }else{
  //         v = val;
  //     }
  // },
  // getCity:function(){

  // }
})