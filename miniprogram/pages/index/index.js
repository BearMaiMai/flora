// pages/index/index.js - 首页
const commonService = require('../../services/common')

Page({
  data: {
    statusBarHeight: 20,
    loading: false,
    userName: '花友小明',
    bannerList: [],
    dailyTip: '',
    recommendList: [],
    seasonTips: [
      { icon: '🚿', title: '浇水技巧', desc: '保持土壤微湿', gradient: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' },
      { icon: '☀️', title: '光照管理', desc: '日照6小时', gradient: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)' },
      { icon: '✂️', title: '修剪指南', desc: '春季适当修剪', gradient: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)' },
      { icon: '🌱', title: '施肥方法', desc: '薄肥勤施', gradient: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' },
    ],
  },

  async onLoad() {
    await this.loadHomeData()
  },

  async onPullDownRefresh() {
    await this.loadHomeData()
    wx.stopPullDownRefresh()
  },

  async loadHomeData() {
    this.setData({ loading: true })
    try {
      const result = await commonService.getHomeData()
      const payload = (result && result.data) || {}
      const recommendList = Array.isArray(payload.recommendList)
        ? this.pickUniqueTop3(payload.recommendList).map(item => this.normalizeRecommendItem(item))
        : []

      this.setData({
        dailyTip: payload.dailyTip || '给花花浇点水吧 💧',
        recommendList,
      })
    } catch (err) {
      console.error('首页加载失败:', err)
      wx.showToast({
        title: '首页数据加载失败',
        icon: 'none',
      })
      this.setData({
        dailyTip: '给花花浇点水吧 💧',
        recommendList: [],
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  pickUniqueTop3(list) {
    const seen = new Set()
    const output = []

    for (const item of list) {
      const name = ((item && item.name) || '').trim().toLowerCase()
      const category = ((item && item.category) || '').trim().toLowerCase()
      const key = name ? `${name}__${category}` : ((item && item._id) || '')
      if (!key || seen.has(key)) continue
      seen.add(key)
      output.push(item)
      if (output.length >= 3) break
    }

    return output
  },

  normalizeRecommendItem(item) {
    const difficultyNum = Number(item && item.difficulty) || 1
    // 过滤不可用的云存储图片（cloud:// 协议的文件实际不存在于云存储）
    const rawImage = (item && item.coverImage) || ''
    const coverImage = rawImage.startsWith('cloud://') ? '' : rawImage
    return {
      _id: item && item._id ? item._id : '',
      name: (item && item.name) || '未命名花卉',
      category: (item && item.category) || '未分类',
      difficulty: Math.min(Math.max(difficultyNum, 1), 5),
      coverImage,
      description: (item && item.description) || '暂无简介',
    }
  },

  // 跳转到花卉百科
  goToEncyclopedia() {
    wx.switchTab({ url: '/pages/encyclopedia/index' })
  },

  // 跳转到种植指南
  goToGuide() {
    wx.navigateTo({ url: '/pages/guide/index' })
  },

  // 跳转到花卉详情
  goToFlowerDetail(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    wx.navigateTo({ url: `/pages/encyclopedia/detail?id=${id}` })
  },
})