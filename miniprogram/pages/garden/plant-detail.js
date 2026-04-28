// pages/garden/plant-detail.js - 植物详情页
Page({
  data: { loading: true, plant: null, diaryList: [] },
  onLoad(options) {
    if (options.id) this.loadPlantDetail(options.id)
  },
  async loadPlantDetail(id) {
    this.setData({ loading: true })
    try {
      // TODO: 加载植物详情和日记
      console.log('加载植物详情, id:', id)
    } catch (err) {
      console.error('加载失败:', err)
    } finally {
      this.setData({ loading: false })
    }
  },
  goToAddDiary() {
    const { plant } = this.data
    wx.navigateTo({ url: `/pages/garden/diary-edit?plantId=${plant?._id}` })
  },
})
