// pages/profile/index.js - 个人中心
const userService = require('../../services/user')
const reminderService = require('../../services/reminder')
const { uploadImage, safeImageURL } = require('../../utils/image')
const { checkImage } = require('../../utils/security')

// 临时存储用户授权的头像和昵称（新 API 方式收集）
let _pendingAvatar = ''
let _pendingNickname = ''

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
    const app = getApp()
    const loggedIn = !!(app.globalData && app.globalData.isLoggedIn)
    // 优先级：globalData（最新）> 本地状态
    if (loggedIn !== this.data.isLoggedIn) {
      this.setData({ isLoggedIn: loggedIn })
    }
    if (loggedIn) {
      this.loadStats()
      this.refreshUserInfo()
    } else {
      // 退出登录后彻底清掉本地缓存的 userInfo 和 stats
      this.setData({
        userInfo: { avatarUrl: '', nickName: '' },
        stats: { plantCount: 0, diaryCount: 0, favoriteCount: 0 },
        reminderCount: 0,
      })
    }
  },

  async refreshUserInfo() {
    try {
      const res = await userService.getInfo()
      const data = (res && res.data) || {}
      const avatarUrl = await safeImageURL(data.avatarUrl || '')
      const userInfo = { avatarUrl, nickName: data.nickName || data.nickname || '花友' }
      getApp().globalData.userInfo = userInfo
      this.setData({ userInfo })
    } catch (err) { console.error('refreshUserInfo:', err) }
  },

  /**
   * 静默登录：使用云开发的 openid 自动登录
   */
  async silentLogin() {
    try {
      const res = await userService.login()
      const data = (res && res.data) || {}
      const avatarUrl = await safeImageURL(data.avatarUrl || '')
      const userInfo = { avatarUrl, nickName: data.nickName || data.nickname || '花友' }
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

  /**
   * 新 API：用户选择头像回调（替代已废弃的 getUserProfile）
   */
  onChooseAvatar(e) {
    const avatarUrl = (e.detail && e.detail.avatarUrl) || ''
    if (!avatarUrl) return
    _pendingAvatar = avatarUrl
    // 已登录状态：用户更换头像，直接更新（昵称用现有的）
    if (this.data.isLoggedIn) {
      this.updateAvatarOnly()
      return
    }
    // 未登录状态：如果昵称也已填写，自动触发登录
    if (_pendingNickname) this.doLogin()
  },

  /**
   * 已登录用户更换头像（只改头像不动昵称）
   */
  async updateAvatarOnly() {
    let cloudAvatar = _pendingAvatar || ''
    if (!cloudAvatar) return
    wx.showLoading({ title: '上传头像...', mask: true })
    try {
      // 上传到云存储
      if (!cloudAvatar.startsWith('cloud://')) {
        cloudAvatar = await uploadImage(cloudAvatar, 'avatars')
      }
      // 内容安全检测
      const imgResult = await checkImage(cloudAvatar)
      if (!imgResult.allPassed) {
        wx.hideLoading()
        wx.showToast({ title: '图片违规，请更换', icon: 'none' })
        return
      }
      // 仅更新头像
      await userService.updateInfo({ avatarUrl: cloudAvatar })
      const httpsUrl = await safeImageURL(cloudAvatar)
      const userInfo = { ...this.data.userInfo, avatarUrl: httpsUrl }
      const app = getApp()
      app.globalData.userInfo = userInfo
      this.setData({ userInfo })
      _pendingAvatar = ''
      wx.hideLoading()
      wx.showToast({ title: '头像已更新', icon: 'success' })
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '上传失败', icon: 'none' })
    }
  },

  /**
   * 新 API：用户输入昵称回调
   */
  onNicknameInput(e) {
    _pendingNickname = (e.detail && e.detail.value) || ''
    // 昵称填入后自动登录（不关键盘，由系统处理）
    if (_pendingNickname && !this.data.isLoggedIn) {
      this.doLogin()
    }
  },

  /**
   * 执行登录（收集齐头像+昵称后调用）
   */
  async doLogin() {
    const nickName = (_pendingNickname || '').trim()
    let cloudAvatar = _pendingAvatar || ''

    // 至少需要昵称才执行登录
    if (!nickName) {
      wx.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }

    wx.showLoading({ title: '登录中...', mask: true })
    try {
      // 如果有头像，上传到云存储
      if (cloudAvatar && !cloudAvatar.startsWith('cloud://')) {
        try {
          cloudAvatar = await uploadImage(cloudAvatar, 'avatars')
          const imgResult = await checkImage(cloudAvatar)
          if (!imgResult.allPassed) {
            console.warn('[login] 头像安全检测未通过，使用默认头像')
            cloudAvatar = ''
          }
        } catch (e) {
          console.warn('头像上传云存储失败，使用原 URL:', e)
          cloudAvatar = _pendingAvatar
        }
      }

      await userService.login({})
      await userService.updateInfo({
        nickName,
        avatarUrl: cloudAvatar,
      })

      const userInfo = { nickName, avatarUrl: cloudAvatar }
      const app = getApp()
      app.globalData.userInfo = userInfo
      app.globalData.isLoggedIn = true
      this.setData({ userInfo, isLoggedIn: true })
      this.loadStats()

      // 关闭键盘（用微信昵称弹窗需要主动隐藏）
      wx.hideKeyboard()

      // 清理临时状态
      _pendingAvatar = ''
      _pendingNickname = ''

      wx.hideLoading()
      wx.showToast({ title: '登录成功', icon: 'success' })
    } catch (err) {
      console.error('登录失败:', err)
      wx.hideLoading()
      wx.hideKeyboard()
      _pendingNickname = ''
      wx.showToast({ title: err.message || '登录失败', icon: 'none' })
    }
  },

  /** @deprecated 已废弃，保留以防旧版基础库兜底 */
  onLogin() {
    // 兼容提示：引导用户使用新的头像/昵称填写方式
    wx.showToast({ title: '请先填写昵称后确认登录', icon: 'none' })
  },

  goToReminder() {
    wx.navigateTo({ url: '/pages/reminder/index' })
  },

  goToGarden() {
    wx.switchTab({ url: '/pages/garden/index' })
  },

  goToDiaryList() {
    wx.switchTab({ url: '/pages/garden/index' })
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
    wx.navigateTo({ url: '/pages/profile/settings/index?about=1' })
  },

  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          userService.logout().catch(() => {})
          const app = getApp()
          app.globalData.userInfo = null
          app.globalData.isLoggedIn = false
          wx.setStorageSync('loggedOut', true)
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
