// pages/encyclopedia/detail.js - 花卉详情页
const flowerService = require('../../services/flower')
const userService = require('../../services/user')
const plantService = require('../../services/plant')

Page({
  data: {
    loading: false,
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20,
    flower: null,
    isFavorite: false,
    favoriteSubmitting: false,
    careExpanded: false,  // 养护卡片是否展开
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
      this.setData({
        flower,
        isFavorite: !!rawFlower.isFavorite,
      })

      wx.setNavigationBarTitle({ title: flower.name || '花卉详情' })
    } catch (err) {
      console.error('获取花卉详情失败:', err)
      wx.showToast({ title: '花卉详情加载失败', icon: 'none' })
      this.setData({ flower: null })
    } finally {
      this.setData({ loading: false })
    }
  },

  normalizeFlower(raw) {
    const alias = Array.isArray(raw.alias)
      ? raw.alias.join('、')
      : (raw.alias || '')

    const waterText = raw.waterInterval
      ? `每 ${raw.waterInterval} 天浇水一次`
      : (raw.waterDays || '根据土壤干湿度灵活浇水')

    const fertilizeText = raw.fertilizeInterval
      ? `每 ${raw.fertilizeInterval} 天施肥一次`
      : (raw.fertilizeDays || '生长季薄肥勤施，休眠期停肥')

    // tags → 标签链（保持原始数组）
    const tags = Array.isArray(raw.tags) ? raw.tags : []

    // tips → 独立养护小贴士（可能是 tags 二次利用 or 独立字段）
    const tips = Array.isArray(raw.tips) ? raw.tips : []

    const difficultyNum = Number(raw.difficulty) || 1

    // 过滤不可用的云存储图片
    const rawImage = raw.coverImage || ''
    const coverImage = rawImage.startsWith('cloud://') ? '' : rawImage

    return {
      ...raw,
      alias,
      difficulty: Math.min(Math.max(difficultyNum, 1), 5),
      coverImage,
      description: raw.description || '暂无简介',
      tags,
      careGuide: {
        water: waterText,
        light: raw.light || '明亮散射光',
        soil: raw.soil || '疏松透气土壤',
        temperature: raw.temperature || '15-30°C',
        fertilizer: fertilizeText,
        humidity: raw.humidity || '保持通风，空气干燥时可适当喷水',
      },
      tips,
      expertAnswer: Array.isArray(raw.expertAnswer) ? raw.expertAnswer : [],
    }
  },

  // 养护指南展开/收起
  toggleCareExpand() {
    this.setData({ careExpanded: !this.data.careExpanded })
  },

  async onToggleFavorite() {
    const { flower, isFavorite, favoriteSubmitting } = this.data
    if (!flower || !flower._id || favoriteSubmitting) return

    this.setData({ favoriteSubmitting: true, isFavorite: !isFavorite })
    wx.vibrateShort({ type: 'light' })

    try {
      const res = await userService.toggleFavorite(flower._id)
      // 后端返回最新状态以纠正乐观更新
      const next = res && res.data && typeof res.data.isFavorite === 'boolean'
        ? res.data.isFavorite
        : !isFavorite
      this.setData({ isFavorite: next })
      wx.showToast({
        title: next ? '已收藏' : '已取消收藏',
        icon: 'success',
      })
    } catch (err) {
      console.error('收藏失败:', err)
      // 回滚
      this.setData({ isFavorite })
      wx.showToast({ title: '操作失败', icon: 'none' })
    } finally {
      this.setData({ favoriteSubmitting: false })
    }
  },

  /**
   * 添加到我的花园
   */
  async onAddToGarden() {
    const flower = this.data.flower
    if (!flower || !flower._id) return

    const inputRes = await new Promise(resolve => {
      wx.showModal({
        title: '添加到花园',
        content: '为它取个昵称吧',
        editable: true,
        placeholderText: flower.name,
        success: r => resolve(r),
        fail: () => resolve(null),
      })
    })
    if (!inputRes || !inputRes.confirm) return

    const nickname = (inputRes.content || '').trim() || flower.name

    wx.showLoading({ title: '添加中...', mask: true })
    try {
      await plantService.add({
        flowerId: flower._id,
        flowerName: flower.name,
        nickname,
      })
      wx.hideLoading()
      wx.showToast({ title: '已添加到花园', icon: 'success' })
      setTimeout(() => {
        wx.switchTab({ url: '/pages/garden/index' })
      }, 1200)
    } catch (err) {
      wx.hideLoading()
      console.error('添加植物失败:', err)
      wx.showToast({ title: err.message || '添加失败', icon: 'none' })
    }
  },

  onShareAppMessage() {
    const flower = this.data.flower
    return {
      title: flower ? `来看看「${flower.name}」的养护方法` : '养花呀 - 花卉百科',
      path: `/pages/encyclopedia/detail?id=${flower && flower._id ? flower._id : ''}`,
    }
  },
})
