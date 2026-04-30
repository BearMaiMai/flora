// pages/encyclopedia/index.js - 花卉百科列表页

// 分类 → 标签颜色映射
const CATEGORY_COLOR_MAP = {
  '观叶植物': 'green',
  '开花植物': 'orange',
  '多肉植物': 'purple',
  '香草植物': 'blue',
  '水培植物': 'blue',
  '果蔬植物': 'orange',
}

function addTagColor(list) {
  return list.map(item => ({
    ...item,
    tagColor: CATEGORY_COLOR_MAP[item.category] || 'green',
  }))
}

Page({
  data: {
    loading: false,
    keyword: '',
    categoryList: ['观叶植物', '开花植物', '多肉植物', '香草植物', '水培植物', '果蔬植物'],
    currentCategory: '',
    flowerList: [],
    allFlowers: [], // 存储全量数据用于筛选
    page: 1,
    hasMore: false,
  },

  onLoad() {
    const rawList = [
      { _id: 'f1', name: '绿萝', category: '观叶植物', difficulty: 1, description: '最好养的室内植物，净化空气' },
      { _id: 'f2', name: '多肉（桃蛋）', category: '多肉植物', difficulty: 2, description: '粉嫩可爱，喜阳光充足' },
      { _id: 'f3', name: '栀子花', category: '开花植物', difficulty: 3, description: '花香浓郁，洁白优雅' },
      { _id: 'f4', name: '薄荷', category: '香草植物', difficulty: 1, description: '清新提神，可泡茶入菜' },
      { _id: 'f5', name: '月季', category: '开花植物', difficulty: 3, description: '花色丰富，四季开花' },
      { _id: 'f6', name: '虎皮兰', category: '观叶植物', difficulty: 1, description: '耐阴耐旱，净化甲醛能手' },
      { _id: 'f7', name: '铜钱草', category: '水培植物', difficulty: 1, description: '圆圆的叶子像铜钱，水土皆可养' },
      { _id: 'f8', name: '茉莉花', category: '开花植物', difficulty: 2, description: '花香袭人，夏季盛开' },
      { _id: 'f9', name: '碰碰香', category: '香草植物', difficulty: 1, description: '触碰散发清香，驱蚊好帮手' },
      { _id: 'f10', name: '小番茄', category: '果蔬植物', difficulty: 2, description: '阳台种植首选，好种又好吃' },
      { _id: 'f11', name: '龟背竹', category: '观叶植物', difficulty: 2, description: '大叶植物，北欧风格装饰必备' },
      { _id: 'f12', name: '仙人掌', category: '多肉植物', difficulty: 1, description: '超级耐旱，一个月浇一次水就行' },
    ]
    const flowers = addTagColor(rawList)
    this.setData({
      flowerList: flowers,
      allFlowers: flowers,
    })
  },

  onReachBottom() {
    // 模拟数据暂不分页
  },

  onPullDownRefresh() {
    this.setData({
      currentCategory: '',
      keyword: '',
      flowerList: this.data.allFlowers,
    })
    wx.stopPullDownRefresh()
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
      result = result.filter(f => f.name.indexOf(keyword) > -1 || f.description.indexOf(keyword) > -1)
    }
    this.setData({ flowerList: result })
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/encyclopedia/detail?id=${id}` })
  },
})
