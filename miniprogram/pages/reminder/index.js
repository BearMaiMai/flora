// pages/reminder/index.js - 养护提醒页
const reminderService = require('../../services/reminder')
const plantService = require('../../services/plant')
const {
  REMINDER_TYPES,
  REMINDER_TYPE_ICON,
  REMINDER_TYPE_LABEL,
  REMINDER_TYPE_CLASS,
} = require('../../constants/reminder')
const { toDate, formatNextTime, isToday } = require('../../utils/util')

const TYPE_OPTIONS = Object.values(REMINDER_TYPES) // [{value,label,icon}]

Page({
  data: {
    loading: true,
    currentFilter: 'all',
    reminderList: [],
    filteredList: [],
    pendingCount: 0,

    // 添加/编辑提醒弹层
    sheetVisible: false,
    sheetMode: 'add', // add | edit
    sheetForm: {
      _id: '',
      plantId: '',
      type: 'water',
      intervalDays: 3,
      firstTime: '',  // YYYY-MM-DD
    },
    typeOptions: TYPE_OPTIONS,
    plantOptions: [],
    plantPickerIndex: 0,
  },

  onLoad() {
    this.loadReminders()
    this.loadPlants()
  },

  onShow() {
    if (!this.data.loading) {
      this.loadReminders(true)
    }
  },

  async onPullDownRefresh() {
    await this.loadReminders(true)
    wx.stopPullDownRefresh()
  },

  async loadReminders(silent = false) {
    if (!silent) this.setData({ loading: true })
    try {
      // 始终请求包含已完成的提醒，由前端 applyFilter 按tab筛选
      const res = await reminderService.getList({ includeCompleted: true })
      const list = ((res && res.data) || []).map(r => this.normalize(r))
      this.setData({ reminderList: list })
      this.applyFilter()
    } catch (err) {
      console.error('提醒加载失败:', err)
      if (!silent) wx.showToast({ title: err.message || '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  async loadPlants() {
    try {
      const res = await plantService.getList()
      const plants = ((res && res.data) || []).map(p => ({
        _id: p._id,
        nickname: p.nickname || p.flowerName || '未命名',
        flowerName: p.flowerName || '',
      }))
      this.setData({ plantOptions: plants })
    } catch (err) {
      console.warn('植物列表加载失败:', err)
    }
  },

  normalize(raw) {
    const next = toDate(raw.nextRemindAt)
    const done = !!raw.isCompleted
    const overdue = !done && next && next.getTime() < Date.now()
    return {
      _id: raw._id,
      plantId: raw.plantId,
      plantName: raw.title || raw.plantName || '植物',
      type: REMINDER_TYPE_LABEL[raw.type] || raw.type,
      typeRaw: raw.type,
      typeClass: REMINDER_TYPE_CLASS[raw.type] || 'type-other',
      icon: REMINDER_TYPE_ICON[raw.type] || '⏰',
      time: raw.intervalDays ? `每${raw.intervalDays}天` : '',
      intervalDays: raw.intervalDays,
      nextTime: formatNextTime(raw.nextRemindAt),
      location: raw.plantLocation || raw.location || '',
      done,
      overdue: !!overdue,
      _isToday: isToday(raw.nextRemindAt),
    }
  },

  onFilterTap(e) {
    const { filter } = e.currentTarget.dataset
    this.setData({ currentFilter: filter })
    this.applyFilter()
  },

  applyFilter() {
    const { reminderList, currentFilter } = this.data
    let filteredList = []

    switch (currentFilter) {
      case 'today':
        filteredList = reminderList.filter(r => r._isToday)
        break
      case 'pending':
        filteredList = reminderList.filter(r => !r.done)
        break
      case 'done':
        filteredList = reminderList.filter(r => r.done)
        break
      default:
        filteredList = [...reminderList]
    }

    const pendingCount = reminderList.filter(r => !r.done).length
    this.setData({ filteredList, pendingCount })
  },

  async onComplete(e) {
    const { id } = e.currentTarget.dataset
    wx.vibrateShort({ type: 'light' })
    const reminderList = this.data.reminderList.map(r =>
      r._id === id ? { ...r, done: true } : r
    )
    this.setData({ reminderList })
    this.applyFilter()

    try {
      await reminderService.complete(id)
      await this.loadReminders(true)
    } catch (err) {
      console.error('完成提醒失败:', err)
      const rollback = this.data.reminderList.map(r =>
        r._id === id ? { ...r, done: false } : r
      )
      this.setData({ reminderList: rollback })
      this.applyFilter()
      wx.showToast({ title: err.message || '操作失败', icon: 'none' })
    }
  },

  // ============ 底部弹层：添加/编辑提醒 ============

  onAddTap() {
    if (!this.data.plantOptions.length) {
      wx.showToast({ title: '请先添加植物', icon: 'none' })
      return
    }
    const today = new Date().toISOString().slice(0, 10)
    this.setData({
      sheetVisible: true,
      sheetMode: 'add',
      sheetForm: {
        _id: '',
        plantId: this.data.plantOptions[0]._id,
        type: 'water',
        intervalDays: 3,
        firstTime: today,
      },
      plantPickerIndex: 0,
    })
  },

  onEditTap(e) {
    const { id } = e.currentTarget.dataset
    const item = this.data.reminderList.find(r => r._id === id)
    if (!item) return
    const plantIdx = this.data.plantOptions.findIndex(p => p._id === item.plantId)
    this.setData({
      sheetVisible: true,
      sheetMode: 'edit',
      sheetForm: {
        _id: item._id,
        plantId: item.plantId,
        type: item.typeRaw,
        intervalDays: item.intervalDays || 3,
        firstTime: '',
      },
      plantPickerIndex: plantIdx >= 0 ? plantIdx : 0,
    })
  },

  onSheetClose() {
    this.setData({ sheetVisible: false })
  },

  // 阻止冒泡
  noop() {},

  onPlantPickerChange(e) {
    const idx = Number(e.detail.value)
    const plant = this.data.plantOptions[idx]
    if (!plant) return
    this.setData({
      plantPickerIndex: idx,
      'sheetForm.plantId': plant._id,
    })
  },

  onTypeTap(e) {
    const { value } = e.currentTarget.dataset
    this.setData({ 'sheetForm.type': value })
  },

  onIntervalInput(e) {
    const v = Math.max(1, Math.min(365, Number(e.detail.value) || 1))
    this.setData({ 'sheetForm.intervalDays': v })
  },

  onFirstTimeChange(e) {
    this.setData({ 'sheetForm.firstTime': e.detail.value })
  },

  async onSheetSubmit() {
    const { sheetMode, sheetForm } = this.data
    if (!sheetForm.plantId) {
      wx.showToast({ title: '请选择植物', icon: 'none' })
      return
    }
    if (!sheetForm.intervalDays || sheetForm.intervalDays < 1) {
      wx.showToast({ title: '请填写正确的天数', icon: 'none' })
      return
    }

    wx.showLoading({ title: '保存中...', mask: true })
    try {
      if (sheetMode === 'add') {
        const payload = {
          plantId: sheetForm.plantId,
          type: sheetForm.type,
          intervalDays: sheetForm.intervalDays,
        }
        if (sheetForm.firstTime) {
          payload.firstTime = new Date(sheetForm.firstTime + 'T09:00:00').toISOString()
        }
        await reminderService.add(payload)
      } else {
        await reminderService.update(sheetForm._id, {
          intervalDays: sheetForm.intervalDays,
        })
      }
      wx.hideLoading()
      wx.showToast({ title: '已保存', icon: 'success' })
      this.setData({ sheetVisible: false })
      await this.loadReminders(true)
    } catch (err) {
      wx.hideLoading()
      console.error('保存提醒失败:', err)
      wx.showToast({ title: err.message || '保存失败', icon: 'none' })
    }
  },

  async onSheetDelete() {
    if (this.data.sheetMode !== 'edit') return
    const id = this.data.sheetForm._id
    const confirm = await new Promise(resolve => {
      wx.showModal({
        title: '删除提醒',
        content: '确定要删除这条提醒吗？',
        confirmColor: '#E53935',
        success: r => resolve(r.confirm),
      })
    })
    if (!confirm) return

    wx.showLoading({ title: '删除中...', mask: true })
    try {
      await reminderService.remove(id)
      wx.hideLoading()
      wx.showToast({ title: '已删除', icon: 'success' })
      this.setData({ sheetVisible: false })
      await this.loadReminders(true)
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '删除失败', icon: 'none' })
    }
  },
})
