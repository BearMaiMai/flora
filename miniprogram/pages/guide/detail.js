// pages/guide/detail.js - 种植指南详情页
Page({
  data: { loading: true, guide: null },
  onLoad(options) {
    if (options.id) this.loadGuideDetail(options.id)
  },
  async loadGuideDetail(id) {
    this.setData({ loading: true })
    try {
      // TODO: 加载指南详情
      console.log('加载指南详情, id:', id)
    } catch (err) {
      console.error('加载失败:', err)
    } finally {
      this.setData({ loading: false })
    }
  },
})
