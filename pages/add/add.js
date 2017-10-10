var app = getApp();
const config = require('../../config');
const toast = require('../../utils/toast');
var addressList = [];

var EARTH_RADIUS = 6378137.0;    //单位M
var PI = Math.PI;


Page({
  data: {
    addressList: addressList,
    footdata: config.footdata,
  }
  ,
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    var self = this;

    var Url = config.requestUrl + '/front/user/location/query';
    wx.request({
      url: Url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        sessionId: app.globalData.userData.data.sessionId
      },
      success: function (res) {
        console.log(Url, res);

        addressList = [];
        for (var i = 0; i < res.data.length; i++) {
          var info =
            {
              address: res.data[i].shop_position,
              longitude: res.data[i].longitude,
              latitude: res.data[i].latitude,
              name:res.data[i].shop_name,
              distance: ''
            };
            addressList.push(info);
        }

        wx.getLocation({
          success: function (res) {
            console.log(res)
            var currentLon = res.longitude
            var currentLa = res.latitude

            for (var i = 0; i < addressList.length; i++) {
              var radLat1 = currentLa * PI / 180.0;
              var radLat2 = addressList[i].latitude * PI / 180.0;

              var a = radLat1 - radLat2;
              var b = currentLon * PI / 180.0 - addressList[i].longitude * PI / 180.0;

              var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));

              s = s * EARTH_RADIUS;
              s = Math.round(s * 10000) / 10000.0 / 1000.0;
              s = s.toFixed(1)
              addressList[i].distance = s;

            }

            addressList.sort(function (a, b) {
              return a.distance - b.distance;
            });

            self.setData({
              addressList: addressList
            })
          },
          fail: function(res){
            self.setData({
              addressList: addressList
            })
          }
        })
      },
    })

  },
  openLocation: function (e) {
    console.log(e.currentTarget.dataset.name)
    wx.openLocation({
      latitude: e.currentTarget.dataset.latitude,
      longitude: e.currentTarget.dataset.longitude,
      name: e.currentTarget.dataset.name,
      scale: 28
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  tapTell: function (e) {
    app.tapTell(this, e);
  }
})