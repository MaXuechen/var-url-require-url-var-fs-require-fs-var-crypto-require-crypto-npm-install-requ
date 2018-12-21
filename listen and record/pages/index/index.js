Page({
  validate2() {
    wx.navigateTo({
      url: '../listen/listen',
    })
  },
  validate1() {
    wx.switchTab({
      url: '../recommend/recommend',
   
    })
  },
  data: {
  }
})