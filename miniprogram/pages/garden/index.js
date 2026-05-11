// pages/garden/index.js - 我的花园
Page({
  data: {
    loading: false,
    plantList: [
      {
        _id: 'p1',
        flowerName: '绿萝',
        nickname: '小绿',
        location: '客厅窗台',
        days: 45,
        status: 'healthy',
        lastWatered: '2天前',
      },
      {
        _id: 'p2',
        flowerName: '多肉（桃蛋）',
        nickname: '小桃',
        location: '阳台',
        days: 30,
        status: 'healthy',
        lastWatered: '5天前',
      },
      {
        _id: 'p3',
        flowerName: '栀子花',
        nickname: '小栀',
        location: '卧室',
        days: 15,
        status: 'needCare',
        lastWatered: '3天前',
      },
    ],
    todayReminders: [
      { _id: 'r1', plantName: '小绿', type: '浇水', icon: '💧', time: '09:00' },
      { _id: 'r2', plantName: '小栀', type: '施肥', icon: '🧪', time: '10:00' },
      { _id: 'r3', plantName: '小桃', type: '晒太阳', icon: '☀️', time: '14:00' },
    ],
  },

  onLoad() {
    // 模拟数据已直接写入
  },

  onShow() {
    // 后续接入 service 后刷新
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },

  onCompleteReminder(e) {
    const { id } = e.currentTarget.dataset
    // 先播放完成动画 + 振动反馈
    wx.vibrateShort({ type: 'light' })
    // 标记为已完成
    const todayReminders = this.data.todayReminders.map((r) =>
      r._id === id ? { ...r, done: true } : r
    )
    this.setData({ todayReminders })
    // 延迟后移除
    setTimeout(() => {
      const updatedReminders = this.data.todayReminders.filter((r) => r._id !== id)
      this.setData({ todayReminders: updatedReminders })
      wx.showToast({ title: '已完成', icon: 'success' })
    }, 500)
  },

  goToPlantDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/garden/plant-detail?id=${id}` })
  },

  goToAddPlant() {
    wx.switchTab({ url: '/pages/encyclopedia/index' })
  },
})
