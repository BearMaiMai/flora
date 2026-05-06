// pages/reminder/index.js - 养护提醒页
Page({
  data: {
    loading: false,
    currentFilter: 'all',
    reminderList: [
      { _id: 'r1', plantName: '小绿（绿萝）', type: '浇水', icon: '💧', time: '每3天', nextTime: '明天 09:00', done: false, overdue: false },
      { _id: 'r2', plantName: '小栀（栀子花）', type: '施肥', icon: '🧪', time: '每2周', nextTime: '今天 10:00', done: false, overdue: true },
      { _id: 'r3', plantName: '小桃（桃蛋）', type: '晒太阳', icon: '☀️', time: '每天', nextTime: '今天 14:00', done: false, overdue: false },
      { _id: 'r4', plantName: '小绿（绿萝）', type: '喷水', icon: '💨', time: '每2天', nextTime: '后天 08:00', done: false, overdue: false },
      { _id: 'r5', plantName: '小栀（栀子花）', type: '浇水', icon: '💧', time: '每2天', nextTime: '今天 09:00', done: true, overdue: false },
    ],
    filteredList: [],
    pendingCount: 0,
  },

  onLoad() {
    this.applyFilter()
  },

  onShow() {
    this.applyFilter()
  },

  onFilterTap(e) {
    const { filter } = e.currentTarget.dataset
    this.setData({ currentFilter: filter })
    this.applyFilter()
  },

  applyFilter() {
    const { reminderList, currentFilter } = this.data
    let filteredList = []

    switch (currentFilter) {
      case 'today':
        filteredList = reminderList.filter(r => r.nextTime.includes('今天'))
        break
      case 'pending':
        filteredList = reminderList.filter(r => !r.done)
        break
      case 'done':
        filteredList = reminderList.filter(r => r.done)
        break
      default:
        filteredList = [...reminderList]
    }

    const pendingCount = reminderList.filter(r => !r.done).length
    this.setData({ filteredList, pendingCount })
  },

  onComplete(e) {
    const { id } = e.currentTarget.dataset
    const reminderList = this.data.reminderList.map(r => {
      if (r._id === id) return { ...r, done: !r.done }
      return r
    })
    this.setData({ reminderList })
    this.applyFilter()
    wx.showToast({ title: '状态已更新', icon: 'success' })
  },
})
