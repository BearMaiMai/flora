// pages/garden/index.js - 我的花园
Page({
  data: {
    loading: true,
    plantList: [],
    todayReminders: [],
  },

  onLoad() {
    this.loadGardenData()
  },

  onShow() {
    this.loadGardenData()
  },

  onPullDownRefresh() {
    this.loadGardenData().then(() => wx.stopPullDownRefresh())
  },

  async loadGardenData() {
    this.setData({ loading: true })
    try {
      // TODO: 加载我的植物列表和今日提醒
      console.log('加载花园数据')
    } catch (err) {
      console.error('加载花园数据失败:', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  goToPlantDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/garden/plant-detail?id=${id}` })
  },

  goToAddPlant() {
    wx.switchTab({ url: '/pages/encyclopedia/index' })
  },
})
