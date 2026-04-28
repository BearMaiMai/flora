// pages/profile/index.js - 个人中心
Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    stats: { plantCount: 0, diaryCount: 0, favoriteCount: 0 },
  },
  onLoad() { this.checkLoginStatus() },
  onShow() { this.checkLoginStatus() },
  checkLoginStatus() {
    const app = getApp()
    this.setData({
      userInfo: app.globalData.userInfo,
      isLoggedIn: app.globalData.isLoggedIn,
    })
  },
  onLogin() {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        const app = getApp()
        app.globalData.userInfo = res.userInfo
        app.globalData.isLoggedIn = true
        this.setData({ userInfo: res.userInfo, isLoggedIn: true })
        // TODO: 调用云函数保存用户信息
      },
    })
  },
  goToReminder() {
    wx.navigateTo({ url: '/pages/reminder/index' })
  },
  goToFavorites() {
    // TODO: 跳转到收藏页
  },
  goToAbout() {
    // TODO: 跳转到关于页面
  },
})
