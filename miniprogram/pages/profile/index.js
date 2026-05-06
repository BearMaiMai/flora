// pages/profile/index.js - 个人中心
Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '花友小明',
    },
    isLoggedIn: true,
    stats: { plantCount: 3, diaryCount: 12, favoriteCount: 8 },
    reminderCount: 3,
  },
  onLoad() {
    // 模拟已登录状态
  },
  onShow() {
    // 后续接入 service 后刷新
  },
  onLogin() {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        const app = getApp()
        app.globalData.userInfo = res.userInfo
        app.globalData.isLoggedIn = true
        this.setData({ userInfo: res.userInfo, isLoggedIn: true })
      },
    })
  },
  goToReminder() {
    wx.navigateTo({ url: '/pages/reminder/index' })
  },
  goToFavorites() {
    wx.showToast({ title: '收藏页开发中', icon: 'none' })
  },
  goToGuide() {
    wx.navigateTo({ url: '/pages/guide/index' })
  },
  goToSettings() {
    wx.showToast({ title: '设置页开发中', icon: 'none' })
  },
  goToAbout() {
    wx.showModal({
      title: '关于养花呀',
      content: '养花呀 v1.0.0\n\n一款帮助花卉爱好者轻松种花的小助手 🌸\n\n功能：花卉百科、我的花园、养护提醒、成长日记',
      showCancel: false,
    })
  },

  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            isLoggedIn: false,
            userInfo: { avatarUrl: '', nickName: '' },
          })
          wx.showToast({ title: '已退出登录', icon: 'success' })
        }
      },
    })
  },
})
