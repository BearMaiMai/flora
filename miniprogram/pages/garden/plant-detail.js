// pages/garden/plant-detail.js - 植物详情页
const plantService = require('../../services/plant')
const diaryService = require('../../services/diary')
const { toDate, formatRelativeDays } = require('../../utils/util')
const { toTempFileURLs } = require('../../utils/image')

Page({
  data: {
    loading: true,
    plant: null,
    stats: { diaryCount: 0, lastWatered: '尚未记录', lastFertilized: '尚未记录' },
    diaryList: [],
    statusLabel: '状态良好',
  },

  // 状态选项
  STATUS_OPTIONS: ['healthy', 'growing', 'flowering', 'wilting', 'sick', 'dormant'],
  STATUS_LABELS: {
    healthy: '状态良好',
    growing: '生长中',
    flowering: '开花中',
    wilting: '枯萎中',
    sick: '生病了',
    dormant: '休眠中',
  },

  onLoad(options) {
    this.plantId = options && options.id ? options.id : ''
    if (!this.plantId) {
      wx.showToast({ title: '缺少植物ID', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1000)
      return
    }
    this.loadDetail()
  },

  onShow() {
    if (this.plantId && !this.data.loading) {
      this.loadDiary()
    }
  },

  async loadDetail() {
    this.setData({ loading: true })
    try {
      const [detailRes, diaryRes] = await Promise.all([
        plantService.getDetail(this.plantId),
        diaryService.getList(this.plantId),
      ])
      const raw = (detailRes && detailRes.data) || null
      if (!raw || !raw._id) throw new Error('未找到该植物')

      const plant = this.normalizePlant(raw)
      this.setData({
        statusLabel: this.STATUS_LABELS[plant.status] || '状态良好',
      })
      const diaryList = await Promise.all(
        ((diaryRes && diaryRes.data) || []).map(async d => this.normalizeDiary(d))
      )
      // 解析图片为 https 临时链接
      for (const d of diaryList) {
        if (d.images && d.images.length) {
          d.images = await toTempFileURLs(d.images)
        }
      }
      const stats = {
        diaryCount: diaryList.length,
        lastWatered: formatRelativeDays(raw.lastWateredAt),
        lastFertilized: formatRelativeDays(raw.lastFertilizedAt),
      }

      this.setData({ plant, diaryList, stats })
      wx.setNavigationBarTitle({ title: plant.nickname || '植物详情' })
    } catch (err) {
      console.error('获取植物详情失败:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  async loadDiary() {
    try {
      const diaryRes = await diaryService.getList(this.plantId)
      const diaryList = ((diaryRes && diaryRes.data) || []).map(d => this.normalizeDiary(d))
      // 解析图片为 https 临时链接
      for (const d of diaryList) {
        if (d.images && d.images.length) {
          d.images = await toTempFileURLs(d.images)
        }
      }
      this.setData({
        diaryList,
        'stats.diaryCount': diaryList.length,
      })
    } catch (err) {
      console.error('刷新日记失败:', err)
    }
  },

  normalizePlant(raw) {
    const created = toDate(raw.createdAt)
    const days = created
      ? Math.max(1, Math.floor((Date.now() - created.getTime()) / 86400000))
      : 0
    const addDate = created ? created.toISOString().slice(0, 10) : ''
    return {
      _id: raw._id,
      flowerId: raw.flowerId,
      flowerName: raw.flowerName || (raw.flower && raw.flower.name) || '',
      nickname: raw.nickname || '',
      location: raw.location || '',
      days,
      status: raw.status || 'healthy',
      addDate,
    }
  },

  normalizeDiary(raw) {
    const t = toDate(raw.createdAt) || toDate(raw.date)
    const date = t ? t.toISOString().slice(5, 10) : ''
    return {
      _id: raw._id,
      content: raw.content || '',
      date,
      images: Array.isArray(raw.images) ? raw.images : [],
    }
  },

  goToAddDiary() {
    if (!this.plantId) return
    wx.navigateTo({ url: `/pages/garden/diary-edit?plantId=${this.plantId}` })
  },

  goToEditDiary(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    wx.navigateTo({
      url: `/pages/garden/diary-edit?plantId=${this.plantId}&diaryId=${id}`,
    })
  },

  // 移除植物
  async onRemovePlant() {
    const plant = this.data.plant
    if (!plant) return
    const res = await new Promise(resolve => {
      wx.showModal({
        title: '移除植物',
        content: `确定要移除「${plant.nickname}」吗？相关日记和提醒也会被一起删除。`,
        confirmColor: '#E53935',
        success: r => resolve(r.confirm),
      })
    })
    if (!res) return

    wx.showLoading({ title: '处理中...', mask: true })
    try {
      await plantService.remove(plant._id)
      wx.hideLoading()
      wx.showToast({ title: '已移除', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 800)
    } catch (err) {
      wx.hideLoading()
      console.error('移除失败:', err)
      wx.showToast({ title: '移除失败', icon: 'none' })
    }
  },

  // ============ 编辑功能（2.12 + 2.15）============

  // 编辑昵称
  async onEditNickname() {
    const plant = this.data.plant
    if (!plant) return
    const res = await new Promise(resolve => {
      wx.showModal({
        title: '修改昵称',
        editable: true,
        placeholderText: '给植物取个名字',
        content: plant.nickname,
        success: r => resolve(r),
        fail: () => resolve(null),
      })
    })
    if (!res || !res.confirm) return
    const nickname = (res.content || '').trim()
    if (!nickname || nickname === plant.nickname) return

    try {
      await plantService.update(plant._id, { nickname })
      this.setData({ 'plant.nickname': nickname })
      wx.setNavigationBarTitle({ title: nickname || '植物详情' })
      wx.showToast({ title: '已更新', icon: 'success' })
    } catch (err) {
      console.error('更新昵称失败:', err)
      wx.showToast({ title: '更新失败', icon: 'none' })
    }
  },

  // 编辑位置
  async onEditLocation() {
    const plant = this.data.plant
    if (!plant) return
    const res = await new Promise(resolve => {
      wx.showModal({
        title: '修改位置',
        editable: true,
        placeholderText: '如：阳台、客厅、窗台',
        content: plant.location,
        success: r => resolve(r),
        fail: () => resolve(null),
      })
    })
    if (!res || !res.confirm) return
    const location = (res.content || '').trim()

    try {
      await plantService.update(plant._id, { location })
      this.setData({ 'plant.location': location })
      wx.showToast({ title: '已更新', icon: 'success' })
    } catch (err) {
      console.error('更新位置失败:', err)
      wx.showToast({ title: '更新失败', icon: 'none' })
    }
  },

  // 编辑状态（2.12）
  onEditStatus() {
    const plant = this.data.plant
    if (!plant) return
    const currentIdx = this.STATUS_OPTIONS.indexOf(plant.status || 'healthy')
    wx.showActionSheet({
      itemList: this.STATUS_OPTIONS.map(s => this.STATUS_LABELS[s]),
      current: currentIdx >= 0 ? currentIdx : 0,
      success: async (res) => {
        const status = this.STATUS_OPTIONS[res.tapIndex]
        if (status === plant.status) return
        try {
          await plantService.update(plant._id, { status })
          this.setData({
            'plant.status': status,
            statusLabel: this.STATUS_LABELS[status],
          })
          wx.showToast({ title: '已更新', icon: 'success' })
        } catch (err) {
          console.error('更新状态失败:', err)
          wx.showToast({ title: '更新失败', icon: 'none' })
        }
      },
    })
  },

  // 编辑购买日期（2.15）
  onEditPurchaseDate() {
    const plant = this.data.plant
    if (!plant) return
    wx.showModal({
      title: '修改购买/种植日期',
      content: '将打开日期选择器，选择后将重新计算养护天数。',
      confirmText: '选择日期',
      success: (res) => {
        if (!res.confirm) return
        // 计算当前日期或从 purchaseDate 推算初始值
        const defaultDate = plant.addDate || new Date().toISOString().slice(0, 10)
        wx.showDatePicker && wx.showDatePicker ? (
          wx.showDatePicker({
            value: defaultDate,
            success: async (dateRes) => {
              const purchaseDate = dateRes.date || dateRes.detail?.value
              if (!purchaseDate) return
              try {
                await plantService.update(plant._id, { purchaseDate })
                // 重新加载以刷新天数显示
                this.loadDetail()
                wx.showToast({ title: '已更新', icon: 'success' })
              } catch (err) {
                console.error('更新日期失败:', err)
                wx.showToast({ title: '更新失败', icon: 'none' })
              }
            },
          })
        ) : (
          // 兜底：使用 picker 模式
          wx.showToast({ title: '请使用新版微信体验完整功能', icon: 'none' })
        )
      },
    })
  },
})
