// pages/guide/index.js - 种植指南列表页
Page({
  data: {
    loading: false,
    featuredGuide: {
      _id: 'g1',
      title: '新手入门：如何开始你的第一盆花',
      summary: '从选花、选盆到日常养护，手把手教你养好第一盆花',
      icon: '🌱',
    },
    categoryList: [
      { name: '入门基础', icon: '🌱', bgColor: '#E8F5E9' },
      { name: '浇水技巧', icon: '💧', bgColor: '#E3F2FD' },
      { name: '光照指南', icon: '☀️', bgColor: '#FFF8E1' },
      { name: '施肥方案', icon: '🧪', bgColor: '#F3E5F5' },
      { name: '病虫防治', icon: '🔍', bgColor: '#FBE9E7' },
      { name: '换盆教程', icon: '🪴', bgColor: '#EFEBE9' },
    ],
    guideList: [
      {
        _id: 'g1',
        title: '新手入门：第一盆花怎么养？',
        summary: '从选花、选盆到日常养护，手把手教你养好第一盆花',
        icon: '🌱',
        difficulty: '入门',
        readTime: '5分钟阅读',
      },
      {
        _id: 'g2',
        title: '春季换盆全攻略',
        summary: '什么时候换盆、怎么换、换完怎么护理',
        icon: '🪴',
        difficulty: '进阶',
        readTime: '4分钟阅读',
      },
      {
        _id: 'g3',
        title: '多肉植物浇水指南',
        summary: '多肉到底多久浇一次水？不同季节有讲究',
        icon: '💧',
        difficulty: '入门',
        readTime: '3分钟阅读',
      },
      {
        _id: 'g4',
        title: '室内植物光照不足怎么办？',
        summary: '北向房间也能养好花！补光灯选择技巧',
        icon: '☀️',
        difficulty: '进阶',
        readTime: '4分钟阅读',
      },
      {
        _id: 'g5',
        title: '常见病虫害识别与防治',
        summary: '叶子发黄、长虫子别慌，对症下药轻松解决',
        icon: '🔍',
        difficulty: '高级',
        readTime: '6分钟阅读',
      },
    ],
  },

  onLoad() {},

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/guide/detail?id=${id}` })
  },
})
