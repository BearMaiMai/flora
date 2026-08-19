// pages/guide/index.js - 种植指南列表页
const guideService = require('../../services/guide')

const CACHE_KEY = 'guide_list_v3'
const CACHE_EXPIRE = 5 * 60 * 1000

const CATEGORY_MAP = {
  '入门基础': 'basics', '浇水技巧': 'watering', '光照指南': 'lighting',
  '施肥方案': 'fertilizing', '病虫防治': 'pests', '换盆教程': 'repotting', '修剪养护': 'trimming',
}
const CATEGORY_ICON = {
  '入门基础': '🌱', '浇水技巧': '💧', '光照指南': '☀️',
  '施肥方案': '🧪', '病虫防治': '🔍', '换盆教程': '🪴', '修剪养护': '✂️',
}

function getCache() {
  try {
    const c = wx.getStorageSync(CACHE_KEY)
    if (c && Date.now() - c.timestamp < CACHE_EXPIRE) return c.data
  } catch (e) {}
  return null
}
function setCache(data) {
  try { wx.setStorageSync(CACHE_KEY, { data, timestamp: Date.now() }) } catch (e) {}
}

Page({
  data: {
    loading: false,
    activeCategory: '', activeCategoryLabel: '',
    featuredGuide: null,
    categoryList: [
      { key: 'basics', label: '入门基础', icon: '🌱', bgColor: '#E8F5E9' },
      { key: 'watering', label: '浇水技巧', icon: '💧', bgColor: '#E3F2FD' },
      { key: 'lighting', label: '光照指南', icon: '☀️', bgColor: '#FFF8E1' },
      { key: 'fertilizing', label: '施肥方案', icon: '🧪', bgColor: '#F3E5F5' },
      { key: 'pests', label: '病虫防治', icon: '🔍', bgColor: '#FBE9E7' },
      { key: 'repotting', label: '换盆教程', icon: '🪴', bgColor: '#EFEBE9' },
      { key: 'trimming', label: '修剪养护', icon: '✂️', bgColor: '#E0F2F1' },
    ],
    guideList: [],
    filteredGuideList: [],
  },

onLoad(options) {
  const cached = getCache()
  if (cached) {
    this.setData({ featuredGuide: cached.featuredGuide, guideList: cached.guideList })
    this.filterGuideList()
  }
  if (options && options.category) {
    // 兼容传入的是中文名（如"浇水技巧"）或英文 key（如"watering"）
    const cat = decodeURIComponent(options.category)
    const key = CATEGORY_MAP[cat] || cat
    this.setData({ activeCategory: key })
  }
  this.loadGuides()
},

  onPullDownRefresh() { this.loadGuides().then(() => wx.stopPullDownRefresh()) },

  async loadGuides() {
    this.setData({ loading: true })
    try {
      const [listRes, featuredRes] = await Promise.all([
        guideService.getList({ pageSize: 50 }),
        guideService.getFeatured().catch(() => ({ data: null })),
      ])
      const rawList = (listRes && listRes.data && listRes.data.list) || []
      const guideList = rawList.map(raw => ({
        _id: raw._id, title: raw.title, summary: raw.summary,
        icon: CATEGORY_ICON[raw.category] || '🌱',
        difficulty: raw.level || '入门',
        readTime: raw.readTime ? raw.readTime + '分钟阅读' : '3分钟阅读',
        category: CATEGORY_MAP[raw.category] || '',
      }))
      let featuredGuide = null
      if (featuredRes && featuredRes.data) {
        const r = featuredRes.data
        featuredGuide = {
          _id: r._id, title: r.title, summary: r.summary,
          icon: CATEGORY_ICON[r.category] || '🌱',
          difficulty: r.level, readTime: r.readTime ? r.readTime + '分钟阅读' : '',
        }
      }
      if (!featuredGuide && guideList.length) featuredGuide = guideList[0]
      setCache({ featuredGuide, guideList })
      this.setData({ featuredGuide, guideList })
    } catch (err) {
      console.error('加载种植指南失败:', err)
    } finally {
      this.setData({ loading: false })
      this.filterGuideList()
    }
  },

  filterGuideList() {
    const { guideList, activeCategory, categoryList } = this.data
    const filtered = activeCategory ? guideList.filter(i => i.category === activeCategory) : guideList
    const label = activeCategory ? (categoryList.find(c => c.key === activeCategory) || {}).label || '' : ''
    this.setData({ filteredGuideList: filtered, activeCategoryLabel: label })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    if (id) wx.navigateTo({ url: '/pages/guide/detail?id=' + id })
  },

  onSelectCategory(e) {
    const c = e.currentTarget.dataset.category
    this.setData({ activeCategory: c === this.data.activeCategory ? '' : c })
    this.filterGuideList()
  },
})
