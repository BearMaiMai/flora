/**
 * 获取种植指南文章列表（支持分页和分类筛选，仅返回已发布文章）
 * @param {Number} page - 页码 | 1~100 | 整数 | 1 | 默认第1页
 * @param {Number} pageSize - 每页数量 | 1~50 | 整数 | 10 | 默认10条
 * @param {String} [category] - 分类名称 | String | 浇水技巧 | 可选值：入门基础/浇水技巧/光照指南/施肥方案/病虫防治/换盆教程/修剪养护；不传则返回全部
 * @returns {Object} data - 分页结果对象 | Object | - | 是 | -
 * @returns {Array} data.list - 文章列表 | Array | - | 是 | 含 _id,title,summary,category,coverImage,readTime,level,viewCount,createdAt
 * @returns {Number} data.total - 总文章数 | Number | - | 是 | -
 * @returns {Number} data.page - 当前页码 | Number | - | 是 | -
 * @returns {Number} data.pageSize - 每页数量 | Number | - | 是 | -
 * @returns {Boolean} data.hasMore - 是否有更多 | Boolean | - | 是 | true=还有下一页,false=已到底
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'guide',
 *   data: { action: 'list', page: 1, pageSize: 10, category: '浇水技巧' }
 * })
 * // res.result = { code: 0, data: { list: [...], total: 25, page: 1, pageSize: 10, hasMore: true } }
 */
module.exports = async (event, context, { db }) => {
  const { page = 1, pageSize = 10, category } = event

  const PAGE = Math.max(1, Math.min(100, page))
  const SIZE = Math.max(1, Math.min(50, pageSize))
  const skip = (PAGE - 1) * SIZE

  // 构建查询：只查已发布文章
  let query = db.collection('care_guides').where({ status: 'published' })

  if (category && category !== '全部') {
    query = query.where({ status: 'published', category })
  }

  const countRes = await query.count()
  const total = countRes.total

  const { data: list } = await query
    .orderBy('createdAt', 'desc')
    .skip(skip)
    .limit(SIZE)
    .field({
      _id: true,
      title: true,
      summary: true,
      category: true,
      coverImage: true,
      readTime: true,
      level: true,
      viewCount: true,
      createdAt: true,
    })
    .get()

  return {
    code: 0,
    data: {
      list,
      total,
      page: PAGE,
      pageSize: SIZE,
      hasMore: skip + SIZE < total,
    },
  }
}
