// pages/garden/index.js - 我的花园
const plantService = require('../../services/plant')
const reminderService = require('../../services/reminder')
const diaryService = require('../../services/diary')
const { REMINDER_TYPE_ICON, REMINDER_TYPE_LABEL } = require('../../constants/reminder')
const { toDate, formatDate, formatRelativeDays, isToday } = require('../../utils/util')

Page({
  data: {
    loading: true,
    plantList: [],
    todayReminders: [],
    diaryList: [],
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
      const [plantRes, reminderRes, diaryRes] = await Promise.all([
        plantService.getList(),
        reminderService.getList(),
        diaryService.getList(),
      ])
      const plantList = ((plantRes && plantRes.data) || []).map(p => this.normalizePlant(p))
      const todayReminders = ((reminderRes && reminderRes.data) || [])
        .filter(r => !r.isCompleted && isToday(r.nextRemindAt))
        .map(r => this.normalizeReminder(r, plantList))
      const diaryList = this.normalizeDiaries(diaryRes && diaryRes.data, plantList)
      this.setData({ plantList, todayReminders, diaryList })
    } catch (err) {
      console.error('我的花园加载失败:', err)
      if (!silent) wx.showToast({ title: '加载失败，请下拉重试', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  normalizeDiaries(rawList, plantList) {
    const list = (rawList || []).slice(0, 3).map(d => {
      const plant = plantList.find(p => p._id === d.plantId)
      return {
        _id: d._id,
        plantName: (plant && plant.nickname) || '植物',
        content: (d.content || '').slice(0, 80) + ((d.content || '').length > 80 ? '…' : ''),
        createdAt: formatDate(d.createdAt, 'YYYY-MM-DD HH:mm'),
      }
    })
    return list
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

  goToAddDiary() {
    if (!this.data.plantList.length) {
      wx.showToast({ title: '请先添加植物', icon: 'none' })
      return
    }
    wx.navigateTo({ url: `/pages/garden/diary-edit?plantId=${this.data.plantList[0]._id}` })
  },

  goToDiaryDetail(e) {
    const id = e.currentTarget.dataset.id
    if (id) wx.navigateTo({ url: `/pages/garden/diary-edit?diaryId=${id}` })
  },

  onDeleteDiary(e) {
    const id = e.currentTarget.dataset.id
    if (!id) return
    wx.showModal({
      title: '删除日记',
      content: '确定要删除这条日记吗？',
      confirmColor: '#E53935',
      success: async (res) => {
        if (!res.confirm) return
        try {
          await diaryService.remove(id)
          const diaryList = this.data.diaryList.filter(d => d._id !== id)
          this.setData({ diaryList })
          wx.showToast({ title: '已删除', icon: 'success' })
        } catch (err) {
          wx.showToast({ title: err.message || '删除失败', icon: 'none' })
        }
      },
    })
  },
})
