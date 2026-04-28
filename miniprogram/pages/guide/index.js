// pages/guide/index.js - 种植指南列表页
Page({
  data: { loading: true, guideList: [] },
  onLoad() { this.loadGuideList() },
  async loadGuideList() {
    this.setData({ loading: true })
    try {
      // TODO: 加载种植指南列表
      console.log('加载种植指南')
    } catch (err) {
      console.error('加载失败:', err)
    } finally {
      this.setData({ loading: false })
    }
  },
  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/guide/detail?id=${id}` })
  },
})
