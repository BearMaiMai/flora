// pages/garden/diary-edit.js - 日记编辑页（支持新增 + 编辑）
const diaryService = require('../../services/diary')
const { uploadImages, toTempFileURLs } = require('../../utils/image')

const WEATHER_OPTIONS = [
  { value: '', icon: '', label: '不选' },
  { value: '晴', icon: '☀️', label: '晴' },
  { value: '多云', icon: '⛅', label: '多云' },
  { value: '阴', icon: '☁️', label: '阴' },
  { value: '雨', icon: '🌧️', label: '雨' },
  { value: '雪', icon: '❄️', label: '雪' },
]

const CARE_ACTIONS = [
  { value: 'water', icon: '💧', label: '浇水' },
  { value: 'fertilize', icon: '🧪', label: '施肥' },
  { value: 'prune', icon: '✂️', label: '修剪' },
  { value: 'repot', icon: '🪴', label: '换盆' },
  { value: 'sunlight', icon: '☀️', label: '晒太阳' },
  { value: 'spray', icon: '💨', label: '喷雾' },
]

Page({
  data: {
    plantId: '',
    diaryId: '',
    isEdit: false,
    content: '',
    images: [],
    weather: '',
    careActions: [],
    maxImageCount: 9,
    submitting: false,
    weatherOptions: WEATHER_OPTIONS,
    careActionOptions: CARE_ACTIONS,
  },

  onLoad(options) {
    const plantId = (options && options.plantId) || ''
    const diaryId = (options && options.diaryId) || ''
    const isEdit = !!diaryId
    this.setData({ plantId, diaryId, isEdit })
    wx.setNavigationBarTitle({ title: isEdit ? '编辑日记' : '写日记' })

    if (isEdit) {
      this.loadDiary(diaryId)
    }
  },

  async loadDiary(id) {
    try {
      const res = await diaryService.getDetail(id)
      const raw = (res && res.data) || null
      if (!raw) throw new Error('日记不存在')
      let images = Array.isArray(raw.images) ? raw.images : []
      if (images.length) {
        images = await toTempFileURLs(images)
      }
      this.setData({
        content: raw.content || '',
        images,
        weather: raw.weather || '',
        careActions: Array.isArray(raw.careActions) ? raw.careActions : [],
        plantId: raw.plantId || this.data.plantId,
      })
    } catch (err) {
      console.error('加载日记失败:', err)
      wx.showToast({ title: err.message || '日记加载失败', icon: 'none' })
    }
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  onWeatherTap(e) {
    const { value } = e.currentTarget.dataset
    // 同值再点取消
    this.setData({ weather: this.data.weather === value ? '' : value })
  },

  onCareActionTap(e) {
    const { value } = e.currentTarget.dataset
    const careActions = [...this.data.careActions]
    const idx = careActions.indexOf(value)
    if (idx > -1) careActions.splice(idx, 1)
    else careActions.push(value)
    this.setData({ careActions })
  },

  chooseImage() {
    const remain = this.data.maxImageCount - this.data.images.length
    if (remain <= 0) return
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(f => f.tempFilePath)
        this.setData({ images: [...this.data.images, ...newImages] })
      },
    })
  },

  removeImage(e) {
    const { index } = e.currentTarget.dataset
    const images = this.data.images.filter((_, i) => i !== index)
    this.setData({ images })
  },

  async uploadImagesPipeline(images) {
    return uploadImages(images, 'diary')
  },

  async onSubmit() {
    const content = this.data.content.trim()
    if (!content) {
      wx.showToast({ title: '请输入日记内容', icon: 'none' })
      return
    }
    if (this.data.submitting) return
    this.setData({ submitting: true })
    wx.showLoading({ title: '保存中...', mask: true })

    try {
      const images = await this.uploadImagesPipeline(this.data.images)
      const payload = {
        content,
        images,
        weather: this.data.weather || '',
        careActions: this.data.careActions,
      }

      if (this.data.isEdit) {
        await diaryService.update(this.data.diaryId, payload)
      } else {
        if (!this.data.plantId) throw new Error('缺少植物ID')
        await diaryService.add({ plantId: this.data.plantId, ...payload })
      }

      wx.hideLoading()
      wx.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1000)
    } catch (err) {
      console.error('保存失败:', err)
      wx.hideLoading()
      wx.showToast({ title: err.message || '保存失败', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  },

  async onDelete() {
    if (!this.data.isEdit) return
    const res = await new Promise(resolve => {
      wx.showModal({
        title: '删除日记',
        content: '确定要删除这篇日记吗？',
        confirmColor: '#E53935',
        success: r => resolve(r.confirm),
      })
    })
    if (!res) return

    wx.showLoading({ title: '删除中...', mask: true })
    try {
      await diaryService.remove(this.data.diaryId)
      wx.hideLoading()
      wx.showToast({ title: '已删除', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 800)
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '删除失败', icon: 'none' })
    }
  },
})
