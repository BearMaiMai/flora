// pages/encyclopedia/detail.js - 花卉详情页
Page({
  data: {
    loading: true,
    flower: null,
    isFavorite: false,
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.loadFlowerDetail(id)
    }
  },

  async loadFlowerDetail(id) {
    this.setData({ loading: true })
    try {
      // TODO: 调用云函数获取花卉详情
      console.log('加载花卉详情, id:', id)
    } catch (err) {
      console.error('加载花卉详情失败:', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onToggleFavorite() {
    // TODO: 收藏/取消收藏
    this.setData({ isFavorite: !this.data.isFavorite })
  },

  onAddToGarden() {
    // TODO: 添加到我的花园
    wx.showToast({ title: '已添加到花园', icon: 'success' })
  },

  onShareAppMessage() {
    const { flower } = this.data
    return {
      title: flower ? `来看看「${flower.name}」的养护方法` : '养花呀 - 花卉百科',
      path: `/pages/encyclopedia/detail?id=${flower?._id || ''}`,
    }
  },
})
