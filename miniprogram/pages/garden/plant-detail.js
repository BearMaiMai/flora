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
})
