import api from '../../utils/api'
let songUrl = '',name = '', paraID = '',id =''
Page({
  data:{
    ctrl: "音乐控制区域",
    cpTime: '00:00',
    duration: '00:00',
    lrcList: []
  },
  onLoad:function(param) {
    // 页面初始化 options为页面跳转所带来的参数
    let id = param.id
    if (id == '0') this.getSong(paraID)
    else {
      paraID = id
      this.getSong(paraID)
    }
      this.getLrc(paraID)
  },
  onReady:function(){
    // 页面渲染完成
    this.getSongStatus()
    let songName = this.data.songName
      wx.setNavigationBarTitle({
          title: songName ? '正在播放 - ' + songName : 'OpenRadio Player'
    })
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
    api.playCtrl.pause()
  },
  onUnload:function(){
    // 页面关闭
  },
  getSong:function(id) {
    let that = this
    api.request.music({
      data: {
        id: id,
        ids: [id]
      },
      success: (res) => {
        console.log(id)
        songUrl = 'https://api.bzqll.com/music/netease/url?key=579621905&br=999000&id='+id//res.data.songs[0].mp3Url
        let song_info = res.data.songs[0]
        let album_big = song_info.album.blurPicUrl
        let album_small = song_info.album.picUrl
        name = song_info.name
        let author = song_info.artists[0].name
        that.setData({
          nowPlay: songUrl,
          songAuthor: author,
          songName: name,
          album: album_big
        })
        this.playSong(songUrl, name)
      }
    })
  },
  playSong: function (songUrl, name) {
    api.playCtrl.play({
      url: songUrl,
      title: name
    })
  },
  getLrc: function (id) {
    api.request.lrc({
      data: {
        id: id,
        lv: -1
      },
      success: (res) => {
        this.lrcReq(res)
      }
    })
  },
  lrcReq: function (res) {
    let strFot = /\[(\d{2}:\d{2})\.\d{2,3}\](.*)/
    let that = this
    var outLrc = {}
    var lrcList = []
    let lrc = res.data.lrc.lyric
    if (!lrc) return
    let lrcArr = lrc.split('\n') || []

    lrcArr.forEach(function(txt) {
      let forLrc = txt.match(strFot)
      if (!forLrc) return

      let lrcTime = forLrc[1]
      let lrcText = forLrc[2] || '(space)'
      outLrc[lrcTime] = lrcText
    }, that);

    for (let i in outLrc) {
      let ts = i.split(':')
      let time = parseInt(ts[0]) * 60 + parseInt(ts[1])

      if (lrcList.length) {
				lrcList[lrcList.length - 1].endtime = time;
			}

      lrcList.push({
        time: time,
        lrc: outLrc[i]
      })
    }
    // console.log(outLrc)
    that.setData({
      lrcList: lrcList
    })
  },
  getSongStatus: function () {
    let that = this
    setInterval(() => {
      api.playCtrl.getState({
        success: (res) => {
          let status = res.status
          let currentPosition = res.currentPosition
          let duration = res.duration
          if (status === 1) {
            that.setData({
              ct: currentPosition,
              cpTime: this.formatTime(currentPosition),
              duration: this.formatTime(duration),
              musicPg: ((currentPosition / duration) * 100)
            })
          }
        }
      })
   }, 1000);
  },
  clickPlay: function () {
    let that = this
    var play = that.data.status === 'pause' ? 'play' : 'pause'
    api.playCtrl.getState({
      success: (e) => {
        let s = e.status
        switch (s) {
          case 0:
            play = 'play'
            this.playSong(songUrl, name)
            break;
          case 1:
            play = 'pause'
            api.playCtrl.pause()
            break;
          default:
            break;
        }
      }
    })
    that.setData({
      status: play
    })
  },
  formatTime:(time) => {
		time = Math.floor(time);
		var m = Math.floor(time / 60).toString();
		m = m.length < 2 ? '0' + m : m;
		var s = (time - parseInt(m) * 60).toString();
		s = s.length < 2 ? '0' + s : s;
		return m + ':' + s;
	}
})
