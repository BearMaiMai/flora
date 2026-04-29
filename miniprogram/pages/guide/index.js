// pages/guide/index.js - 种植指南列表页
Page({
  data: {
    loading: false,
    guideList: [
      { _id: 'g1', title: '新手入门：第一盆花怎么养？', summary: '从选花、选盆到日常养护，手把手教你养好第一盆花', icon: '🌱' },
      { _id: 'g2', title: '春季换盆全攻略', summary: '什么时候换盆、怎么换、换完怎么护理，看这一篇就够了', icon: '🪴' },
      { _id: 'g3', title: '多肉植物浇水指南', summary: '多肉到底多久浇一次水？不同季节有不同讲究', icon: '💧' },
      { _id: 'g4', title: '室内植物光照不足怎么办？', summary: '北向房间也能养好花！补光灯选择和摆放技巧', icon: '☀️' },
      { _id: 'g5', title: '常见病虫害识别与防治', summary: '叶子发黄、长虫子别慌，对症下药轻松解决', icon: '🔍' },
    ],
  },
  onLoad() {},
  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/guide/detail?id=${id}` })
  },
})
