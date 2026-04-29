// pages/reminder/index.js - 养护提醒页
Page({
  data: {
    loading: false,
    reminderList: [
      { _id: 'r1', plantName: '小绿（绿萝）', type: '浇水', icon: '💧', time: '每3天', nextTime: '明天 09:00', done: false },
      { _id: 'r2', plantName: '小栀（栀子花）', type: '施肥', icon: '🧪', time: '每2周', nextTime: '今天 10:00', done: false },
      { _id: 'r3', plantName: '小桃（桃蛋）', type: '晒太阳', icon: '☀️', time: '每天', nextTime: '今天 14:00', done: false },
      { _id: 'r4', plantName: '小绿（绿萝）', type: '喷水', icon: '💨', time: '每2天', nextTime: '后天 08:00', done: false },
      { _id: 'r5', plantName: '小栀（栀子花）', type: '浇水', icon: '💧', time: '每2天', nextTime: '今天 09:00', done: true },
    ],
  },
  onLoad() {},
  onShow() {},
  onComplete(e) {
    const { id } = e.currentTarget.dataset
    const reminderList = this.data.reminderList.map(r => {
      if (r._id === id) return { ...r, done: !r.done }
      return r
    })
    this.setData({ reminderList })
    wx.showToast({ title: '状态已更新', icon: 'success' })
  },
})
