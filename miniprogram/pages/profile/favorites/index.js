// pages/profile/favorites/index.js - 我的收藏
const userService = require('../../../services/user')
const { CATEGORY_COLOR_MAP, CATEGORY_EMOJI_MAP } = require('../../../constants/flower')

Page({
  data: {
    loading: true,
    favorites: [],
    empty: false,
  },

  onLoad() {
    this.loadFavorites()
  },

  onShow() {
    if (!this.data.loading) {
      this.loadFavorites(true)
    }
  },

  async loadFavorites(silent = false) {
    if (!silent) this.setData({ loading: true, empty: false })
    try {
      const res = await userService.getFavorites()
      // 后端返回 { code, data: { list, total } }
      const rawList = (res && res.data && Array.isArray(res.data.list)) ? res.data.list : []
      const list = rawList.map(item => this.normalize(item))
      this.setData({
        favorites: list,
        empty: list.length === 0,
      })
    } catch (err) {
      console.error('收藏列表加载失败:', err)
      if (!silent) wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  normalize(raw) {
    const category = raw.category || ''
    const rawImage = raw.coverImage || ''
    const coverImage = rawImage.startsWith('cloud://') ? '' : rawImage
    return {
      id: raw._id,
      name: raw.name || '未命名',
      category,
      difficulty: Math.min(Math.max(Number(raw.difficulty) || 1, 1), 5),
      emoji: CATEGORY_EMOJI_MAP[category] || '🌱',
      image: coverImage,
      desc: raw.description || '',
      tagClass: 'tag-' + (CATEGORY_COLOR_MAP[category] || 'green'),
    }
  },

  // 取消收藏
  onUnfavorite(e) {
    const { id } = e.currentTarget.dataset
    const name = e.currentTarget.dataset.name || '该花卉'

    wx.showModal({
      title: '取消收藏',
      content: `确定不再收藏 ${name} 吗？`,
      confirmColor: '#E53935',
      success: async (res) => {
        if (!res.confirm) return
        // 乐观更新
        const oldList = this.data.favorites
        const favorites = oldList.filter(item => item.id !== id)
        this.setData({ favorites, empty: favorites.length === 0 })

        wx.vibrateShort({ type: 'light' })
        try {
          await userService.toggleFavorite(id)
          wx.showToast({ title: '已取消收藏', icon: 'success', duration: 1500 })
        } catch (err) {
          console.error('取消收藏失败:', err)
          // 回滚
          this.setData({ favorites: oldList, empty: false })
          wx.showToast({ title: '操作失败，请重试', icon: 'none' })
        }
      },
    })
  },

  // 点击进入详情
  onTapItem(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/encyclopedia/detail?id=${id}` })
  },

  // 下拉刷新
  async onPullDownRefresh() {
    await this.loadFavorites(true)
    wx.stopPullDownRefresh()
  },

  // 去花卉百科
  goToEncyclopedia() {
    wx.switchTab({ url: '/pages/encyclopedia/index' })
  },
})
