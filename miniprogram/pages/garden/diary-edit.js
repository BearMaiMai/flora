// pages/garden/diary-edit.js - 日记编辑页
Page({
  data: {
    plantId: '',
    content: '',
    images: [],
    maxImageCount: 9,
  },
  onLoad(options) {
    this.setData({ plantId: options.plantId || '' })
  },
  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },
  chooseImage() {
    const remain = this.data.maxImageCount - this.data.images.length
    if (remain <= 0) return
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(f => f.tempFilePath)
        this.setData({ images: [...this.data.images, ...newImages] })
      },
    })
  },
  removeImage(e) {
    const { index } = e.currentTarget.dataset
    const images = this.data.images.filter((_, i) => i !== index)
    this.setData({ images })
  },
  async onSubmit() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请输入日记内容', icon: 'none' })
      return
    }
    try {
      // TODO: 上传图片 + 保存日记
      wx.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    } catch (err) {
      console.error('保存失败:', err)
    }
  },
})
