// pages/garden/plant-detail.js - 植物详情页
Page({
  data: {
    loading: false,
    plant: {
      _id: 'p1',
      flowerName: '绿萝',
      nickname: '小绿',
      location: '客厅窗台',
      days: 62,
      status: 'healthy',
      addDate: '2026-02-28',
    },
    stats: {
      waterCount: 18,
      diaryCount: 3,
      healthScore: 95,
    },
    diaryList: [
      {
        _id: 'd1',
        content: '今天给小绿换了新花盆，用了透气性更好的陶盆。换盆后浇了一次透水。',
        date: '04-28',
        images: [],
      },
      {
        _id: 'd2',
        content: '发现新长了两片嫩叶，生长状态很好！叶子油绿有光泽 ✨',
        date: '04-25',
        images: [],
      },
      {
        _id: 'd3',
        content: '用啤酒兑水擦了叶片，果然变得更亮了。春天是生长季，准备开始每月施肥。',
        date: '04-20',
        images: [],
      },
    ],
  },

  onLoad(options) {
    if (options.id) {
      wx.setNavigationBarTitle({ title: this.data.plant.nickname })
    }
  },

  goToAddDiary() {
    const { plant } = this.data
    wx.navigateTo({ url: `/pages/garden/diary-edit?plantId=${plant._id}` })
  },
})
