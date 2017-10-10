var app = getApp();
const config = require('../../config');
var pageData = {
    cards:[
        // {idx:"01",id:"",times:0,cityName:"",cityId:"",expiredDate:""}
    ]
}
Page({
    data:{
        pageData:pageData,
        footdata:config.footdata
    },
    onLoad:function(option){
        pageData = {
            cards:[]
        }
        var self = this;

        // app.getUserStorage(function(err,userData){
        //     self.loadData();
        // },function(err,userinfo){

        // });
        this.loadData();
    },

    loadData:function(){
        var self = this;
        var Url = config.requestUrl+ '/front/user/queryCardInfo';
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
                for(var i =0 ;i<res.data.cards.length;i++){
                    var j = i+1;
                    var idx = j.toString();
                    if(j<10){
                        idx = "0"+j.toString();
                    }

                    pageData.cards.push({idx:idx,id:res.data.cards[i].id,times:res.data.cards[i].times,cityName:res.data.cards[i].cityName,cityId:res.data.cards[i].cityId,expiredDate:self.fixDate(res.data.cards[i].expiredDate)});
                }
var now=new Date();
                var date = new Date(res.data.cards[0].expiredDate)
                self.setData({
                    pageData:pageData
                }) 
                
            },
            fail:function(err){
                console.log(Url,err);
            }
        })
    },
    fixDate:function(date){
         // if(date.length == 10){
            return date.substring(0,4)+"-"+date.substring(5,7)+"-"+date.substring(8,10);
        // }
        return date;
    },
    tapRecord:function(e){
        console.log(e.currentTarget.dataset);
        wx.navigateTo({
            url: '../record/record?idx=0'
        })
    },
    tapPaystep3:function(e){
        wx.navigateTo({
            url: '../paystep3/paystep3'
        })
    },
    tapTell:function(e){
        app.tapTell(this,e);
    }
})