// pages/profile/settings/index.js - 设置页
const userService = require('../../../services/user')
const settingsUtil = require('../../../utils/settings')
const { uploadImage } = require('../../../utils/image')

const APP_VERSION = 'v1.0.0'

Page({
  data: {
    userInfo: { avatarUrl: '', nickName: '' },
    settings: settingsUtil.getAll(),
    appVersion: APP_VERSION,
    cacheSize: '0K',
    aboutMode: false,
  },

  onLoad(options) {
    const isAbout = !!(options && options.about)
    this.setData({ aboutMode: isAbout })
    if (!isAbout) {
      this.loadUser()
      this.calcCacheSize()
    }
  },

  onShow() {
    if (!this._aboutMode) {
      this.setData({ settings: settingsUtil.getAll() })
    }
  },

  loadUser() {
    const app = getApp()
    const userInfo = (app.globalData && app.globalData.userInfo) || { avatarUrl: '', nickName: '' }
    this.setData({ userInfo })
  },

  // ============ 缓存大小 ============
  calcCacheSize() {
    try {
      const info = wx.getStorageInfoSync()
      const kb = (info.currentSize || 0)
      const text = kb < 1024 ? `${kb}K` : `${(kb / 1024).toFixed(1)}M`
      this.setData({ cacheSize: text })
    } catch (e) {
      this.setData({ cacheSize: '0K' })
    }
  },

  // ============ 个人信息：修改昵称 ============
  async onEditNickname() {
    const res = await new Promise(resolve => {
      wx.showModal({
        title: '修改昵称',
        editable: true,
        placeholderText: '请输入新昵称',
        content: this.data.userInfo.nickName || '',
        success: r => resolve(r),
        fail: () => resolve(null),
      })
    })
    if (!res || !res.confirm) return
    const nickName = (res.content || '').trim()
    if (!nickName) {
      wx.showToast({ title: '昵称不能为空', icon: 'none' })
      return
    }
    if (nickName === this.data.userInfo.nickName) return

    wx.showLoading({ title: '保存中...', mask: true })
    try {
      await userService.updateInfo({ nickName })
      const userInfo = { ...this.data.userInfo, nickName }
      const app = getApp()
      app.globalData.userInfo = userInfo
      this.setData({ userInfo })
      wx.hideLoading()
      wx.showToast({ title: '已更新', icon: 'success' })
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '保存失败', icon: 'none' })
    }
  },

  // ============ 个人信息：修改头像 ============
  async onEditAvatar() {
    const res = await new Promise(resolve => {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: r => resolve(r),
        fail: () => resolve(null),
      })
    })
    if (!res || !res.tempFiles || !res.tempFiles.length) return

    const filePath = res.tempFiles[0].tempFilePath
    wx.showLoading({ title: '上传中...', mask: true })
    try {
      const fileID = await uploadImage(filePath, 'avatars')
      await userService.updateInfo({ avatarUrl: fileID })
      const userInfo = { ...this.data.userInfo, avatarUrl: fileID }
      const app = getApp()
      app.globalData.userInfo = userInfo
      this.setData({ userInfo })
      wx.hideLoading()
      wx.showToast({ title: '已更新', icon: 'success' })
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '上传失败', icon: 'none' })
    }
  },

  // ============ 偏好开关 ============
  onToggleReminder(e) {
    const val = e.detail.value
    settingsUtil.set('reminderEnabled', val)
    this.setData({ 'settings.reminderEnabled': val })
    wx.vibrateShort({ type: 'light' })
  },

  onToggleVibrate(e) {
    const val = e.detail.value
    settingsUtil.set('vibrateEnabled', val)
    this.setData({ 'settings.vibrateEnabled': val })
    if (val) wx.vibrateShort({ type: 'light' })
  },

  onToggleAutoLoad(e) {
    const val = e.detail.value
    settingsUtil.set('autoLoadMore', val)
    this.setData({ 'settings.autoLoadMore': val })
  },

  onToggleLazyLoad(e) {
    const val = e.detail.value
    settingsUtil.set('imageLazyLoad', val)
    this.setData({ 'settings.imageLazyLoad': val })
  },

  // 默认提醒时间
  onDefaultTimeChange(e) {
    const val = e.detail.value
    settingsUtil.set('defaultReminderTime', val)
    this.setData({ 'settings.defaultReminderTime': val })
  },

  // ============ 数据管理 ============
  async onClearCache() {
    const res = await new Promise(resolve => {
      wx.showModal({
        title: '清除缓存',
        content: '清除本地缓存（包括花卉列表/指南列表的本地缓存），不会删除你的植物和日记。',
        confirmColor: '#E53935',
        success: r => resolve(r.confirm),
      })
    })
    if (!res) return

    try {
      // 保留用户偏好和登录态
      const settings = settingsUtil.getAll()
      wx.clearStorageSync()
      // 还原偏好
      const storage = require('../../../utils/storage')
      storage.set('user_settings', settings)
      this.calcCacheSize()
      wx.showToast({ title: '已清除', icon: 'success' })
    } catch (err) {
      wx.showToast({ title: '清除失败', icon: 'none' })
    }
  },

  onCheckUpdate() {
    if (!wx.getUpdateManager) {
      wx.showToast({ title: '当前已是最新版本', icon: 'none' })
      return
    }
    wx.showLoading({ title: '检查中...', mask: true })
    const updateManager = wx.getUpdateManager()

    let handled = false
    const finish = (msg) => {
      if (handled) return
      handled = true
      wx.hideLoading()
      wx.showToast({ title: msg, icon: 'none' })
    }

    updateManager.onCheckForUpdate(res => {
      if (!res.hasUpdate) finish('当前已是最新版本')
    })
    updateManager.onUpdateReady(() => {
      handled = true
      wx.hideLoading()
      wx.showModal({
        title: '更新提示',
        content: '新版本已下载完成，是否重启应用？',
        success: r => {
          if (r.confirm) updateManager.applyUpdate()
        },
      })
    })
    updateManager.onUpdateFailed(() => finish('新版本下载失败'))

    // 兜底：3 秒后还没结果，提示已是最新
    setTimeout(() => finish('当前已是最新版本'), 3000)
  },

  // ============ 关于 ============
  goToAgreement() {
    wx.navigateTo({ url: '/pages/profile/agreement/index' })
  },

  goToPrivacy() {
    wx.navigateTo({ url: '/pages/profile/privacy/index' })
  },

  onFeedback() {
    wx.navigateTo({ url: '/pages/profile/feedback/index' })
  },

  onAbout() {
    wx.navigateTo({ url: '/pages/profile/settings/index?about=1' })
  },
  
  onLoad(options) {
    this._aboutMode = !!(options && options.about)
    if (!this._aboutMode) {
      this.loadUser()
      this.calcCacheSize()
    }
  },

  onShow() {
    if (!this._aboutMode) {
      this.setData({ settings: settingsUtil.getAll() })
    }
  },

  // ============ 退出登录 ============
  async onLogout() {
    const res = await new Promise(resolve => {
      wx.showModal({
        title: '提示',
        content: '确定要退出登录吗？退出后部分功能不可用。',
        confirmColor: '#E53935',
        success: r => resolve(r.confirm),
      })
    })
    if (!res) return

    const app = getApp()
    app.globalData.userInfo = null
    app.globalData.isLoggedIn = false
    this.setData({ userInfo: { avatarUrl: '', nickName: '' } })
    wx.showToast({ title: '已退出登录', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 800)
  },
})
