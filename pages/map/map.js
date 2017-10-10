var dataArray = new Array()
const config = require('../../config');
var app = getApp()
var markers=[]
Page({
  data: {
    markers: markers,
    // controls: [{
    //   id: 2000,
    //   iconPath: "../../image/location.png",
    //   posiiton: {
    //     left: 375 - 120,
    //     top: 50,
    //     width: 100,
    //     height: 40
    //   },
    //   clickeable: true
    // }]
    longitude: 0,
    latitude : 0,
    
    currentLon:0,
    currentLa:0
  },

  onLoad: function (options) {
    var self = this;
    var Url = config.requestUrl + '/front/user/location/query';
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
      success: function (res) {
        var latitude =options.latitude
        var longitude = options.longitude
        wx.openLocation({
          latitude: options.latitude,
          longitude: options.longitude,
          name: "花园桥肯德基",
          scale: 28
        })
      }
    })  
    wx.request({
      url: Url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      data: {
        sessionId: app.globalData.userData.data.sessionId
      },
      success: function (res) {
        console.log(Url, res);

        markers = []

        for (var i = 0; i < res.data.length; i++) {
          var info =
            {
              inconPath: "../../image/location.png",
              id: i,
              latitude: res.data[i].latitude,
              longitude: res.data[i].longitude,
              width: 25,
              height: 25,
              name: res.data[i].shop_name
            };
          markers.push(info);
        }
        console.log(markers);

        self.setData({
          markers: markers,
          longitude: options.longitude,
          latitude: options.latitude
        })

      },

    })


    // var info1 =
    //   {
    //     inconPath: "../../image/location.png",
    //     id: 1,
    //     latitude: 31.976966,
    //     longitude: 118.771669,
    //     width: 25,
    //     height: 25,
    //     name: "南京楚翘城分店"
    //   };

    // var info2 =
    //   {
    //     inconPath: "../../image/location.png",
    //     id: 2,
    //     latitude: 31.940155,
    //     longitude: 118.643752,
    //     width: 25,
    //     height: 25,
    //     name: "江苏泊朗智能洗车店"
    //   };


    // markers.push(info1)
    // markers.push(info2);


    
  },

  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(dataArray[e.markerId])
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
})