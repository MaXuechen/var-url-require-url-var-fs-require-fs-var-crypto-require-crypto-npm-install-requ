//录音管理
const recorderManager = wx.getRecorderManager()
//音频组件控制
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;
var littry 
Page({

  //开始录音的时候
  start: function () {
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  //暂停录音
  pause: function () {
    recorderManager.onPause();
    console.log('暂停录音')
  },
  //停止录音
  stop: function () {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
    })
  },
  //播放声音
  play: function () {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },
  //上传录音
  upload: function () {
    wx.uploadFile({
      url: "http://154.8.148.97:8000",//演示域名、自行配置
      filePath: this.tempFilePath,
      name: '001',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData:
        {
          userId: 12345678 //附加信息为用户ID
        },
      // success: function (res) {
      //   // 利用正则字符串从百度天气API的返回数据中截出今天的温度数据
      //   var str = res.data.results[0].weather_data[0].date;
      //   var tmp1 = str.match(/实时.+/);
      //   var tmp2 = tmp1[0].substring(3, tmp1[0].length - 2);
      //   var tmp = +tmp2;
      success: function (res) {
        //console.log(res)
        var data = JSON.parse(res.data)
        //console.log(data)
        littry = data["metadata"].music[0].title
         console.log(littry)
        wx.showToast({
          title: littry,
          duration:2000,       
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {

      }
    })
  },
  onLoad: function () {

  },
  data: {
    littry2: littry
  }
})
