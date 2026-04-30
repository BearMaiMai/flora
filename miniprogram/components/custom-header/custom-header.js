Component({
  options: {
    virtualHost: true,
  },

  properties: {
    // 是否显示副标题
    showSubtitle: {
      type: Boolean,
      value: true,
    },
  },

  data: {
    statusBarHeight: 20,
  },

  lifetimes: {
    attached() {
      const sysInfo = wx.getSystemInfoSync()
      this.setData({
        statusBarHeight: sysInfo.statusBarHeight || 20,
      })
    },
  },
})
