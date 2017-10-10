var ToastData = {
  img:{
    show:false,
    rightImg:"../../image/right.png",
    errorImg:"../../image/error.png",
    img:"",
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
var imgToast_Timeout = null;
function imgToast(options){
    var o = options||{show:false,txt:"",type:1,self:null,callback:null};
    var self = o.self;
    ToastData.img.show = true;//o.show;
    ToastData.img.type = o.type;
    ToastData.img.txt = o.txt;
    ToastData.img.img = ToastData.img.rightImg;
    if(o.type == 0){
        ToastData.img.img = ToastData.img.errorImg;
    }
    clearTimeout(imgToast_Timeout);
    self.setData({
        ToastData:ToastData
    })
    if(ToastData.img.show){
        imgToast_Timeout = setTimeout(function(){
            ToastData.img.show = false;
            self.setData({
                ToastData:ToastData
            });
            if(o.callback != null){
                o.callback();
            }
        },ToastData.img.duration)
    }
}
var txtToast_Timeout = null;
function txtToast(options){
    var o = options||{show:false,txt:"",self:null,callback:null};
    var self = o.self;
    ToastData.txt.show = true;//o.show;
    ToastData.txt.txt = o.txt;
    clearTimeout(txtToast_Timeout);
    self.setData({
        ToastData:ToastData
    })
    if(ToastData.txt.show){
        txtToast_Timeout = setTimeout(function(){
            ToastData.txt.show = false;
            self.setData({
                ToastData:ToastData
            })
            if(o.callback != null){
                o.callback();
            }
        },ToastData.txt.duration)
    }
}
module.exports = {
  txtToast: txtToast,
  imgToast:imgToast,
  ToastData:ToastData
}
