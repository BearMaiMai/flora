// pages/profile/feedback/index.js - 意见反馈页
const userService = require('../../../services/user')

Page({
  data: {
    content: '',
    contact: '',
    submitting: false,
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  onContactInput(e) {
    this.setData({ contact: e.detail.value })
  },

  async onSubmit() {
    const { content, contact, submitting } = this.data
    if (submitting) return

    if (!content.trim()) {
      wx.showToast({ title: '请输入反馈内容', icon: 'none' })
      return
    }

    this.setData({ submitting: true })
    wx.showLoading({ title: '提交中...', mask: true })

    try {
      await userService.feedback({ content: content.trim(), contact: contact.trim() || undefined })
      wx.hideLoading()
      wx.showToast({ title: '感谢您的反馈', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    } catch (err) {
      wx.hideLoading()
      console.error('提交反馈失败:', err)
      wx.showToast({ title: '提交失败，请重试', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  },
})
