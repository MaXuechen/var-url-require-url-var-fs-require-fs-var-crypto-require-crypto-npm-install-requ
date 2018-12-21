//歌曲接口重构
const apiUrl = {
  host: "https://music.163.com/api/",
    playlist: "playlist/detail/",
    song: "song/detail/",
    lrc: "song/lyric/"
}
    const apIUrl = {
      host: "https://api.bzqll.com/music/netease/song?key=579621905",
      playlist: "playlist/detail/",
      song: "",
      lrc: "song/lyric/"
    }
const ApiUrl = {
    host: "https://api.bzqll.com/music/netease/lrc?key=579621905",
  playlist: "playlist/detail/",
  song: "song/detail/",
  lrc: ""
}
const aPiUrl = {
  host: "https://api.bzqll.com/music/netease/url?key=579621905&br=999000",
  playlist: "playlist/detail/",
  song: "",
  lrc: "song/lyric/"
}
//总觉得日后有各种列表…
const kindsList = {
    // 老人专用: '554473977'
    //怀旧专用：'2139305008'
    //2018上半年最热新歌TOP50:'2303649893'
    //爷爷奶奶：928769164
  hotlistid: '928769164'
}
//广播个接口尝试一下
var wId = 0

//方法封装，page那边太乱了…
const wxRequest = (p, u) => {
    wx.request({
        url: u,
        header: {
            'Content-Type': 'application/json'
        },
        data: p.data || {id: kindsList.hotlistid},  //为了简洁命都不要系列…
        method: 'GET',
        success: (res) => {
            p.success && p.success(res)
        },
        fail: (err) => {
            console.log(err)
        }
    })
}

const playCtrl = {
    getState: (p) => wx.getBackgroundAudioPlayerState({
        success: (res) => {
            p.success && p.success(res)
        }
    }),
    pause: () => wx.pauseBackgroundAudio(),
    play: (p) => wx.playBackgroundAudio({
        dataUrl: p.url,
        title: p.title
    })
}

const request = {
    lrc: (params) => wxRequest(params, apiUrl.host + apiUrl.lrc),
    music: (params) => wxRequest(params, apiUrl.host + apiUrl.song),
    hotList: (params) => {wx.showToast({title: 'Loading..', icon: 'loading'}), wxRequest(params, apiUrl.host + apiUrl.playlist)}}

const netType = (m) => wx.getNetworkType({
    success: (res) => {
        m.success && m.success(res)
    }
})

module.exports = {
    apiUrl,
    kindsList,
    request,
    playCtrl,
    netType,
    wId
}
