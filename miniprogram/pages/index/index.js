// pages/index/index.js - 首页
Page({
  data: {
    statusBarHeight: 20,
    loading: false,
    userName: '花友小明',
    bannerList: [],
    dailyTip: '春季是播种的好时节，多肉植物需要控水，每周浇水一次即可。注意通风和光照，避免闷根腐烂。',
    recommendList: [
      {
        _id: 'mock_1',
        name: '绿萝',
        category: '观叶植物',
        tagColor: 'green',
        difficulty: 1,
        coverImage: '',
        description: '最好养的室内植物之一，净化空气能力强',
      },
      {
        _id: 'mock_2',
        name: '多肉（桃蛋）',
        category: '多肉植物',
        tagColor: 'purple',
        difficulty: 2,
        coverImage: '',
        description: '粉嫩可爱，喜阳光充足的环境',
      },
      {
        _id: 'mock_3',
        name: '栀子花',
        category: '观花植物',
        tagColor: 'orange',
        difficulty: 3,
        coverImage: '',
        description: '花香浓郁，洁白优雅，喜酸性土壤',
      },
      {
        _id: 'mock_4',
        name: '薄荷',
        category: '香草植物',
        tagColor: 'blue',
        difficulty: 1,
        coverImage: '',
        description: '清新提神，可泡茶入菜，生命力旺盛',
      },
      {
        _id: 'mock_5',
        name: '月季',
        category: '观花植物',
        tagColor: 'orange',
        difficulty: 3,
        coverImage: '',
        description: '花色丰富，四季开花，花中皇后',
      },
      {
        _id: 'mock_6',
        name: '虎皮兰',
        category: '观叶植物',
        tagColor: 'green',
        difficulty: 1,
        coverImage: '',
        description: '耐阴耐旱，适合懒人养护，净化甲醛',
      },
    ],
    seasonTips: [
      { icon: '🚿', title: '浇水技巧', desc: '保持土壤微湿', bgColor: '#E3F2FD' },
      { icon: '☀️', title: '光照管理', desc: '日照6小时', bgColor: '#FFF8E1' },
      { icon: '✂️', title: '修剪指南', desc: '春季适当修剪', bgColor: '#F3E5F5' },
      { icon: '🌱', title: '施肥方法', desc: '薄肥勤施', bgColor: '#E8F5E9' },
    ],
  },

  onLoad() {
    // 模拟数据已直接写入 data，后续接入 service 后替换
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },

  // 跳转到花卉百科
  goToEncyclopedia() {
    wx.switchTab({ url: '/pages/encyclopedia/index' })
  },

  // 跳转到种植指南
  goToGuide() {
    wx.navigateTo({ url: '/pages/guide/index' })
  },

  // 跳转到花卉详情
  goToFlowerDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/encyclopedia/detail?id=${id}` })
  },
})
