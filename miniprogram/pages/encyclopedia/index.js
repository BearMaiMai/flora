// pages/encyclopedia/index.js - 花卉百科列表页
const flowerService = require('../../services/flower')
const { CATEGORY_COLOR_MAP } = require('../../constants/flower')
const { debounce } = require('../../utils/util')

const CACHE_KEY = 'encyclopedia_list'
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
    keyword: '',
    categoryList: [],
    currentCategory: '',
    flowerList: [],
    allFlowers: [], // 存储全量数据用于筛选
    page: 1,
    hasMore: false,
  },

  // 搜索防抖实例
  _debounceSearch: null,

  async onLoad() {
    // 先尝试读取缓存
    const cached = getCache()
    if (cached) {
      this.setData({
        allFlowers: cached.allFlowers,
        flowerList: cached.flowerList,
        categoryList: cached.categoryList,
      })
      // 静默刷新背景数据
      this.fetchFlowers(true)
    } else {
      await this.fetchFlowers()
    }
  },

  async onPullDownRefresh() {
    this.setData({
      currentCategory: '',
      keyword: '',
    })

    await this.fetchFlowers(true)
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    // 当前为全量加载，暂不做分页
  },

  async fetchFlowers(forceRefresh = false) {
    // 非强制刷新时，若已有数据则不显示 loading
    const hadData = this.data.allFlowers.length > 0
    if (!hadData || forceRefresh) {
      this.setData({ loading: true })
    }

    try {
      const res = await flowerService.getList({ page: 1, pageSize: 200 })
      const rawList = (res && res.data) || []
      const allFlowers = rawList.map(item => this.normalizeFlowerItem(item))
      const categoryList = this.buildCategoryList(allFlowers)

      this.setData({
        allFlowers,
        flowerList: allFlowers,
        categoryList,
      })

      // 写入本地缓存
      setCache({ allFlowers, flowerList: allFlowers, categoryList })
    } catch (err) {
      console.error('获取花卉列表失败:', err)
      // 有缓存时不报错，静默失败
      if (!hadData) {
        wx.showToast({
          title: '花卉数据加载失败',
          icon: 'none',
        })
        this.setData({ allFlowers: [], flowerList: [], categoryList: [] })
      }
    } finally {
      this.setData({ loading: false })
    }
  },

  normalizeFlowerItem(item) {
    const difficultyNum = Number(item && item.difficulty) || 1
    const category = (item && item.category) || '未分类'
    // 过滤不可用的云存储图片（cloud:// 协议的文件实际不存在于云存储）
    const rawImage = (item && item.coverImage) || ''
    const coverImage = rawImage.startsWith('cloud://') ? '' : rawImage
    return {
      _id: item && item._id ? item._id : '',
      name: (item && item.name) || '未命名花卉',
      category,
      tagColor: CATEGORY_COLOR_MAP[category] || 'green',
      difficulty: Math.min(Math.max(difficultyNum, 1), 5),
      description: (item && item.description) || '暂无介绍',
      coverImage,
    }
  },

  buildCategoryList(flowers) {
    const categorySet = new Set()
    flowers.forEach(item => {
      if (item && item.category) {
        categorySet.add(item.category)
      }
    })
    return Array.from(categorySet)
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value })
    // 防抖搜索：300ms 内不再输入才触发过滤
    if (!this._debounceSearch) {
      this._debounceSearch = debounce(() => {
        this.filterFlowers()
      }, 300)
    }
    this._debounceSearch()
  },

  onSearch() {
    this.filterFlowers()
  },

  onCategoryTap(e) {
    const { category } = e.currentTarget.dataset
    this.setData({ currentCategory: category })
    this.filterFlowers()
  },

  filterFlowers() {
    const { allFlowers, keyword, currentCategory } = this.data
    let result = allFlowers

    if (currentCategory) {
      result = result.filter(f => f.category === currentCategory)
    }

    if (keyword) {
      const text = keyword.trim()
      result = result.filter(f => {
        const inName = (f.name || '').indexOf(text) > -1
        const inDesc = (f.description || '').indexOf(text) > -1
        return inName || inDesc
      })
    }

    this.setData({ flowerList: result })
  },

  onImageError(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    const { flowerList } = this.data
    const index = flowerList.findIndex(item => item._id === id)
    if (index > -1) {
      this.setData({ [`flowerList[${index}].imgError`]: true })
    }
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    wx.navigateTo({ url: `/pages/encyclopedia/detail?id=${id}` })
  },
})