// pages/reminder/index.js - 养护提醒页
Page({
  data: { loading: true, reminderList: [] },
  onLoad() { this.loadReminders() },
  onShow() { this.loadReminders() },
  async loadReminders() {
    this.setData({ loading: true })
    try {
      // TODO: 加载提醒列表
      console.log('加载提醒列表')
    } catch (err) {
      console.error('加载失败:', err)
    } finally {
      this.setData({ loading: false })
    }
  },
  onComplete(e) {
    const { id } = e.currentTarget.dataset
    // TODO: 完成提醒
    console.log('完成提醒:', id)
  },
})
