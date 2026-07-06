// pages/garden/index.js - 我的花园
const plantService = require('../../services/plant')
const reminderService = require('../../services/reminder')
const { REMINDER_TYPE_ICON, REMINDER_TYPE_LABEL } = require('../../constants/reminder')
const { toDate, formatRelativeDays, isToday } = require('../../utils/util')

Page({
  data: {
    loading: true,
    plantList: [],
    todayReminders: [],
    _completingId: null, // 防重入：正在完成的提醒ID
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    if (!this.data.loading) {
      this.loadData(true)
    }
  },

  async onPullDownRefresh() {
    await this.loadData(true)
    wx.stopPullDownRefresh()
  },

  async loadData(silent = false) {
    if (!silent) this.setData({ loading: true })
    try {
      const [plantRes, reminderRes] = await Promise.all([
        plantService.getList(),
        reminderService.getList(),
      ])
      const plantList = ((plantRes && plantRes.data) || []).map(p => this.normalizePlant(p))
      const todayReminders = ((reminderRes && reminderRes.data) || [])
        .filter(r => !r.isCompleted && isToday(r.nextRemindAt))
        .map(r => this.normalizeReminder(r, plantList))
      this.setData({ plantList, todayReminders })
    } catch (err) {
      console.error('我的花园加载失败:', err)
      if (!silent) wx.showToast({ title: '加载失败，请下拉重试', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  normalizePlant(raw) {
    const created = toDate(raw.createdAt)
    const days = created
      ? Math.max(1, Math.floor((Date.now() - created.getTime()) / 86400000))
      : 0
    return {
      _id: raw._id,
      flowerId: raw.flowerId,
      flowerName: raw.flowerName || '',
      nickname: raw.nickname || '',
      location: raw.location || '',
      days,
      status: raw.status || 'healthy',
      lastWatered: formatRelativeDays(raw.lastWateredAt),
    }
  },

  normalizeReminder(raw, plantList) {
    const plant = plantList.find(p => p._id === raw.plantId)
    const next = toDate(raw.nextRemindAt)
    const time = next
      ? `${String(next.getHours()).padStart(2, '0')}:${String(next.getMinutes()).padStart(2, '0')}`
      : ''
    return {
      _id: raw._id,
      plantId: raw.plantId,
      plantName: (plant && plant.nickname) || raw.title || '植物',
      type: REMINDER_TYPE_LABEL[raw.type] || raw.type,
      icon: REMINDER_TYPE_ICON[raw.type] || '⏰',
      time,
      done: !!raw.isCompleted,
    }
  },

  async onCompleteReminder(e) {
    const { id } = e.currentTarget.dataset
    if (this.data._completingId === id) return // 防重入
    this.setData({ _completingId: id })
    wx.vibrateShort({ type: 'light' })
    // 乐观更新
    const todayReminders = this.data.todayReminders.map(r =>
      r._id === id ? { ...r, done: true } : r
    )
    this.setData({ todayReminders })

    try {
      await reminderService.complete(id)
      setTimeout(() => {
        const updated = this.data.todayReminders.filter(r => r._id !== id)
        this.setData({ todayReminders: updated })
        wx.showToast({ title: '已完成', icon: 'success' })
      }, 500)
    } catch (err) {
      console.error('完成提醒失败:', err)
      const rollback = this.data.todayReminders.map(r =>
        r._id === id ? { ...r, done: false } : r
      )
      this.setData({ todayReminders: rollback })
      wx.showToast({ title: '操作失败，请重试', icon: 'none' })
    } finally {
      this.setData({ _completingId: null })
    }
  },

  goToPlantDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/garden/plant-detail?id=${id}` })
  },

  goToAddPlant() {
    wx.switchTab({ url: '/pages/encyclopedia/index' })
  },
})
