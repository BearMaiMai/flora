// pages/profile/index.js - 个人中心
const userService = require('../../services/user')
const reminderService = require('../../services/reminder')
const { uploadImage } = require('../../utils/image')

Page({
  data: {
    userInfo: { avatarUrl: '', nickName: '' },
    isLoggedIn: false,
    stats: { plantCount: 0, diaryCount: 0, favoriteCount: 0 },
    reminderCount: 0,
  },

  onLoad() {
    this.silentLogin()
  },

  onShow() {
    if (this.data.isLoggedIn) {
      this.loadStats()
    }
  },

  /**
   * 静默登录：使用云开发的 openid 自动登录
   */
  async silentLogin() {
    try {
      const res = await userService.login()
      const data = (res && res.data) || {}
      const userInfo = {
        avatarUrl: data.avatarUrl || '',
        nickName: data.nickName || data.nickname || '花友',
      }
      const app = getApp()
      app.globalData.userInfo = userInfo
      app.globalData.isLoggedIn = true
      this.setData({ userInfo, isLoggedIn: true })
      this.loadStats()
    } catch (err) {
      console.warn('静默登录失败:', err)
      this.setData({ isLoggedIn: false })
    }
  },

  async loadStats() {
    try {
      const [statsRes, reminderRes] = await Promise.all([
        userService.getStats(),
        reminderService.getList(),
      ])
      const stats = (statsRes && statsRes.data) || {}
      const reminderList = (reminderRes && reminderRes.data) || []
      this.setData({
        stats: {
          plantCount: stats.plantCount || 0,
          diaryCount: stats.diaryCount || 0,
          favoriteCount: stats.favoriteCount || 0,
        },
        reminderCount: reminderList.filter(r => !r.isCompleted).length,
      })
    } catch (err) {
      console.error('统计数据加载失败:', err)
    }
  },

  onLogin() {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: async (res) => {
        const profile = res.userInfo
        wx.showLoading({ title: '同步中...', mask: true })
        try {
          // 微信返回的 avatarUrl 是临时 URL，需上传到云存储持久化
          let cloudAvatar = profile.avatarUrl
          if (profile.avatarUrl && !profile.avatarUrl.startsWith('cloud://')) {
            try {
              cloudAvatar = await uploadImage(profile.avatarUrl, 'avatars')
            } catch (e) {
              console.warn('头像上传云存储失败，使用原 URL:', e)
              cloudAvatar = profile.avatarUrl
            }
          }

          await userService.login(profile)
          await userService.updateInfo({
            nickName: profile.nickName,
            avatarUrl: cloudAvatar,
          })

          const userInfo = { ...profile, avatarUrl: cloudAvatar }
          const app = getApp()
          app.globalData.userInfo = userInfo
          app.globalData.isLoggedIn = true
          this.setData({ userInfo, isLoggedIn: true })
          this.loadStats()

          wx.hideLoading()
          wx.showToast({ title: '登录成功', icon: 'success' })
        } catch (err) {
          console.error('登录失败:', err)
          wx.hideLoading()
          wx.showToast({ title: err.message || '登录失败', icon: 'none' })
        }
      },
      fail: () => {
        // 用户取消授权，静默处理
      },
    })
  },

  goToReminder() {
    wx.navigateTo({ url: '/pages/reminder/index' })
  },

  goToFavorites() {
    wx.navigateTo({ url: '/pages/profile/favorites/index' })
  },

  goToGuide() {
    wx.navigateTo({ url: '/pages/guide/index' })
  },

  goToSettings() {
    wx.navigateTo({ url: '/pages/profile/settings/index' })
  },

  goToAbout() {
    wx.navigateTo({ url: '/pages/profile/settings/index' })
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
            stats: { plantCount: 0, diaryCount: 0, favoriteCount: 0 },
          })
          wx.showToast({ title: '已退出登录', icon: 'success' })
        }
      },
    })
  },
})
