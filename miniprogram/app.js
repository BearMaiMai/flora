// app.js - 养花呀 (Flora) 小程序入口
App({
  onLaunch() {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }

    wx.cloud.init({
      // env 参数说明：
      //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.bindFunction/bindDatabase/bindStorage）会默认请求哪个云环境的资源
      //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
      //   如不填则使用默认环境（第一个创建的环境）
      env: '',
      traceUser: true,
    })

    this.globalData = {}
  },

  globalData: {
    userInfo: null,
    isLoggedIn: false,
    cloudEnv: '',
  },
})
