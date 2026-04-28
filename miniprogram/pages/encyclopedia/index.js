// pages/encyclopedia/index.js - 花卉百科列表页
Page({
  data: {
    loading: true,
    keyword: '',
    categoryList: [],
    currentCategory: '',
    flowerList: [],
    page: 1,
    hasMore: true,
  },

  onLoad() {
    this.loadFlowerList()
  },

  onReachBottom() {
    if (this.data.hasMore) {
      this.loadFlowerList()
    }
  },

  onPullDownRefresh() {
    this.setData({ page: 1, flowerList: [], hasMore: true })
    this.loadFlowerList().then(() => wx.stopPullDownRefresh())
  },

  async loadFlowerList() {
    this.setData({ loading: true })
    try {
      // TODO: 调用云函数获取花卉列表
      console.log('加载花卉列表, page:', this.data.page)
    } catch (err) {
      console.error('加载花卉列表失败:', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onSearch() {
    this.setData({ page: 1, flowerList: [], hasMore: true })
    this.loadFlowerList()
  },

  onCategoryTap(e) {
    const { category } = e.currentTarget.dataset
    this.setData({ currentCategory: category, page: 1, flowerList: [], hasMore: true })
    this.loadFlowerList()
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/encyclopedia/detail?id=${id}` })
  },
})
