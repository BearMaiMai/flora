// pages/guide/index.js - 种植指南列表页
const CACHE_KEY = 'guide_list_v2'
const CACHE_EXPIRE = 5 * 60 * 1000 // 5分钟

function getCache() {
  try {
    const cache = wx.getStorageSync(CACHE_KEY)
    if (cache && Date.now() - cache.timestamp < CACHE_EXPIRE) {
      return cache.data
    }
  } catch (e) {}
  return null
}

function setCache(data) {
  try {
    wx.setStorageSync(CACHE_KEY, { data, timestamp: Date.now() })
  } catch (e) {}
}

Page({
  data: {
    loading: false,
    activeCategory: '',
    activeCategoryLabel: '',
    featuredGuide: {
      _id: 'g1',
      title: '新手入门：如何开始你的第一盆花',
      summary: '从选花、选盆到日常养护，手把手教你养好第一盆花',
      icon: '🌱',
    },
    categoryList: [
      { key: 'basics', label: '入门基础', icon: '🌱', bgColor: '#E8F5E9' },
      { key: 'watering', label: '浇水技巧', icon: '💧', bgColor: '#E3F2FD' },
      { key: 'lighting', label: '光照指南', icon: '☀️', bgColor: '#FFF8E1' },
      { key: 'fertilizing', label: '施肥方案', icon: '🧪', bgColor: '#F3E5F5' },
      { key: 'pests', label: '病虫防治', icon: '🔍', bgColor: '#FBE9E7' },
      { key: 'repotting', label: '换盆教程', icon: '🪴', bgColor: '#EFEBE9' },
    ],
    guideList: [
      {
        _id: 'g1',
        title: '新手入门：第一盆花怎么养？',
        summary: '从选花、选盆到日常养护，手把手教你养好第一盆花',
        icon: '🌱',
        difficulty: '入门',
        readTime: '5分钟阅读',
        category: 'basics',
      },
      {
        _id: 'g2',
        title: '春季换盆全攻略',
        summary: '什么时候换盆、怎么换、换完怎么护理',
        icon: '🪴',
        difficulty: '进阶',
        readTime: '4分钟阅读',
        category: 'repotting',
      },
      {
        _id: 'g3',
        title: '多肉植物浇水指南',
        summary: '多肉到底多久浇一次水？不同季节有讲究',
        icon: '💧',
        difficulty: '入门',
        readTime: '3分钟阅读',
        category: 'watering',
      },
      {
        _id: 'g4',
        title: '室内植物光照不足怎么办？',
        summary: '北向房间也能养好花！补光灯选择技巧',
        icon: '☀️',
        difficulty: '进阶',
        readTime: '4分钟阅读',
        category: 'lighting',
      },
      {
        _id: 'g5',
        title: '常见病虫害识别与防治',
        summary: '叶子发黄、长虫子别慌，对症下药轻松解决',
        icon: '🔍',
        difficulty: '高级',
        readTime: '6分钟阅读',
        category: 'pests',
      },
    ],
    filteredGuideList: [],
  },

  onLoad(options) {
    const cached = getCache()
    if (cached) {
      this.setData({
        featuredGuide: cached.featuredGuide || this.data.featuredGuide,
        guideList: cached.guideList || this.data.guideList,
      })
    } else {
      // 首次加载，将 mock 数据写入缓存
      setCache({
        featuredGuide: this.data.featuredGuide,
        guideList: this.data.guideList,
      })
    }

    // 从首页跳过来时自动高亮分类
    const initCategory = (options && options.category) || ''
    this.setData({ activeCategory: initCategory })
    this.filterGuideList()
  },

  /** 根据选中分类过滤文章列表 */
  filterGuideList() {
    const { guideList, activeCategory, categoryList } = this.data
    const filtered = activeCategory
      ? guideList.filter(item => item.category === activeCategory)
      : guideList
    const label = activeCategory
      ? (categoryList.find(c => c.key === activeCategory) || {}).label || ''
      : ''
    this.setData({ filteredGuideList: filtered, activeCategoryLabel: label })
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/guide/detail?id=${id}` })
  },

  onSelectCategory(e) {
    const category = e.currentTarget.dataset.category
    const newActive = category === this.data.activeCategory ? '' : category
    this.setData({ activeCategory: newActive })
    this.filterGuideList()
  },
})
