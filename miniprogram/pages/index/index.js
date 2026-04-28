// pages/index/index.js - 首页
Page({
  data: {
    loading: true,
    bannerList: [],
    dailyTip: '',
    recommendList: [],
  },

  onLoad() {
    this.loadHomeData()
  },

  onPullDownRefresh() {
    this.loadHomeData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadHomeData() {
    this.setData({ loading: true })
    try {
      // TODO: 调用云函数获取首页数据
      console.log('加载首页数据')
    } catch (err) {
      console.error('加载首页数据失败:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 跳转到花卉百科
  goToEncyclopedia() {
    wx.switchTab({ url: '/pages/encyclopedia/index' })
  },

  // 跳转到花卉详情
  goToFlowerDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/encyclopedia/detail?id=${id}` })
  },
})
