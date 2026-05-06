// pages/encyclopedia/index.js - 花卉百科列表页
const flowerService = require('../../services/flower')

// 分类 → 标签颜色映射
const CATEGORY_COLOR_MAP = {
  '观叶植物': 'green',
  '开花植物': 'orange',
  '多肉植物': 'purple',
  '香草植物': 'blue',
  '水培植物': 'blue',
  '果蔬植物': 'orange',
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

  async onLoad() {
    await this.fetchFlowers()
  },

  async onPullDownRefresh() {
    this.setData({
      currentCategory: '',
      keyword: '',
    })

    await this.fetchFlowers()
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    // 当前为全量加载，暂不做分页
  },

  async fetchFlowers() {
    this.setData({ loading: true })
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
    } catch (err) {
      console.error('获取花卉列表失败:', err)
      wx.showToast({
        title: '花卉数据加载失败',
        icon: 'none',
      })
      this.setData({ allFlowers: [], flowerList: [], categoryList: [] })
    } finally {
      this.setData({ loading: false })
    }
  },

  normalizeFlowerItem(item) {
    const difficultyNum = Number(item && item.difficulty) || 1
    const category = (item && item.category) || '未分类'
    return {
      _id: item && item._id ? item._id : '',
      name: (item && item.name) || '未命名花卉',
      category,
      tagColor: CATEGORY_COLOR_MAP[category] || 'green',
      difficulty: Math.min(Math.max(difficultyNum, 1), 5),
      description: (item && item.description) || '暂无介绍',
      coverImage: (item && item.coverImage) || '',
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

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    wx.navigateTo({ url: `/pages/encyclopedia/detail?id=${id}` })
  },
})