Page({
  data:{
    text:"Page list"
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
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
  havaTest: function () {
    let id = '0'
    wx.navigateTo({
      url: `../player/player?id=${id}`
    })
  }
})
