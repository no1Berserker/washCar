function checkAdData(){
    var d = config.addata.imgUrls;
    var that = this;
    var adImgUrls = wx.getStorageSync('adImgUrls')
    for(var i = 0;i<d.length;i++){
      for(var j = 0;j<adImgUrls.length;j++){
        if(d[i].url == adImgUrls[j].url){
          d[i].outUrl = adImgUrls[j].outUrl;
        }
      }
    }
    return d;
}
function setAdData(){
    var d = config.addata.imgUrls;
    for(var i = 0;i<d.length;i++){
        if(d[i].outUrl == undefined){
        d[i].outUrl = d[i].url.replace(/(^\s+)|(\s+$)/g,"");
        }
    }
    wx.setStorage({
        key: 'adImgUrls',
        data:d,
        success: function() {
            console.log("res");
        }
    })
    for(var i = 0;i<d.length;i++){
        var l = d[i].outUrl.substring(0, 4);
        if(l == "http"){
            wx.downloadFile({
            url: d[i].outUrl,
            success: function(res) {
                var tempFilePath = res.tempFilePath;
                wx.saveFile({
                tempFilePath: tempFilePath,
                success: function(res) {
                    var savedFilePath = res.savedFilePath;
                    d[i].outUrl = savedFilePath;
                    wx.setStorage({
                    key: 'adImgUrls',
                    data:d,
                    success: function() {
                        console.log("分段存储成功");
                    }
                    })
                }
                })
            }
            })
        }
    }
    // wx.setStorage({
    //   key: 'adImgUrls',
    //   success: function(res) {
    //       console.log(res)
    //   },
    //   fail:function(){
    //       console.log("并没有")
    //   }
    // })
}
module.exports = {
  checkAdData: checkAdData,
  setAdData:setAdData
}
