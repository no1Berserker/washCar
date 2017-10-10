// 进度
function proBar(v,canvasid,color,parms){
    var context = wx.createCanvasContext(canvasid);
    context.beginPath(0);
    var p = parms || {"x":70,"y":70,"width":68,"lw":2};
    var x = p.x,y=p.y,width=p.width,lw = p.lw;

    var tScale  = 1;//devicePixelRatio;
    // context.setFillStyle('#1aad19')
	  context.setStrokeStyle(color);
    context.setLineWidth(lw);

    //方案1
    // if (v <= 25) {

    //     context.arc(x,y,width,Math.PI*1.5,Math.PI*(1.5+v/25*0.5),false);
    // }else{
    //     context.arc(x,y,width,Math.PI*1.5,Math.PI*2,false);
    //     context.arc(x,y,width,0,Math.PI*(v-25)/75*1.5,false);
    // }
    //方案2
    if (v <= 75) {
        context.arc(x,y,width,Math.PI*0.5,Math.PI*(0.5+v/25*0.5),false);

    }else{
        context.arc(x,y,width,Math.PI*0.5,Math.PI*2,false);
        context.arc(x,y,width,0,Math.PI*(v-75)/25*0.5,false);
    }


    // context.scale(0.5, 0.5)
    context.stroke();

    context.draw()
  }



module.exports = {
  proBar: proBar
}
