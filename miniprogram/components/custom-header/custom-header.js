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
      let statusBarHeight = 20
      try {
        if (wx.getWindowInfo) {
          statusBarHeight = wx.getWindowInfo().statusBarHeight
        } else {
          statusBarHeight = wx.getSystemInfoSync().statusBarHeight
        }
      } catch (e) {}
      this.setData({ statusBarHeight: statusBarHeight || 20 })
    },
  },
})
