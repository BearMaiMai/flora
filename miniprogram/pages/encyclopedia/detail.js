// pages/encyclopedia/detail.js - 花卉详情页
const flowerService = require('../../services/flower')

Page({
  data: {
    loading: false,
    statusBarHeight: 20,
    flower: null,
    isFavorite: false,
  },

  onLoad(options) {
    const sysInfo = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sysInfo.statusBarHeight || 20 })

    const id = options && options.id
    if (!id) {
      wx.showToast({ title: '缺少花卉ID', icon: 'none' })
      return
    }
    this.loadFlower(id)
  },

  onHeroImageError() {
    this.setData({ imgError: true })
  },

  onGoBack() {
    wx.navigateBack({ delta: 1 })
  },

  async loadFlower(id) {
    this.setData({ loading: true })
    try {
      const res = await flowerService.getDetail(id)
      const rawFlower = (res && res.data) || null

      if (!rawFlower || !rawFlower._id) {
        throw new Error('未找到花卉详情')
      }

      const flower = this.normalizeFlower(rawFlower)
      this.setData({ flower })

      wx.setNavigationBarTitle({
        title: flower.name || '花卉详情',
      })
    } catch (err) {
      console.error('获取花卉详情失败:', err)
      wx.showToast({
        title: '花卉详情加载失败',
        icon: 'none',
      })
      this.setData({ flower: null })
    } finally {
      this.setData({ loading: false })
    }
  },

  normalizeFlower(raw) {
    const alias = Array.isArray(raw.alias)
      ? raw.alias.join('、')
      : (raw.alias || '')

    const waterText = raw.waterDays
      ? `约每${raw.waterDays}天浇水一次`
      : '根据土壤干湿度灵活浇水'

    const fertilizeText = raw.fertilizeDays
      ? `约每${raw.fertilizeDays}天施肥一次`
      : '生长季薄肥勤施，休眠期停肥'

    const tips = Array.isArray(raw.tips) && raw.tips.length
      ? raw.tips
      : (Array.isArray(raw.tags) ? raw.tags.map(tag => `关键词：${tag}`) : [])

    const difficultyNum = Number(raw.difficulty) || 1

    // 过滤不可用的云存储图片（cloud:// 协议的文件实际不存在于云存储）
    const rawImage = raw.coverImage || ''
    const coverImage = rawImage.startsWith('cloud://') ? '' : rawImage

    return {
      ...raw,
      alias,
      difficulty: Math.min(Math.max(difficultyNum, 1), 5),
      coverImage,
      description: raw.description || '暂无简介',
      careGuide: {
        water: waterText,
        light: raw.light || '明亮散射光',
        soil: raw.soil || raw.soilType || '疏松透气土壤',
        temperature: raw.temperature || '15-30°C',
        fertilizer: fertilizeText,
        humidity: raw.humidity || '保持通风，空气干燥时可适当喷水',
      },
      tips,
    }
  },

  onToggleFavorite() {
    const isFavorite = !this.data.isFavorite
    this.setData({ isFavorite })
    wx.showToast({
      title: isFavorite ? '已收藏' : '已取消收藏',
      icon: 'success',
    })
  },

  onAddToGarden() {
    wx.showToast({ title: '已添加到花园', icon: 'success' })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/garden/index' })
    }, 1500)
  },

  onShareAppMessage() {
    const flower = this.data.flower
    return {
      title: flower ? `来看看「${flower.name}」的养护方法` : '养花呀 - 花卉百科',
      path: `/pages/encyclopedia/detail?id=${flower && flower._id ? flower._id : ''}`,
    }
  },
})