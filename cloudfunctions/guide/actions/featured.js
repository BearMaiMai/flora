/**
 * 获取首页精选文章（最新一篇标记为精选的已发布文章）
 * @returns {Object} data - 精选文章对象 | Object | - | 是 | 含 _id,title,summary,category,coverImage,readTime,level,viewCount,createdAt；无精选时返回 null
 * @returns {String} data._id - 文章ID | String | - | 是 | -
 * @returns {String} data.title - 文章标题 | String | - | 是 | -
 * @returns {String} data.summary - 文章摘要 | String | - | 是 | -
 * @returns {String} data.category - 文章分类 | String | - | 是 | -
 * @returns {String} data.coverImage - 封面图云存储 fileID | String | - | 否 | -
 * @returns {Number} data.readTime - 阅读时长（分钟） | Number | - | 是 | -
 * @returns {String} data.level - 难度级别 | String | - | 是 | 入门/进阶/高级
 * @returns {Number} data.viewCount - 阅读量 | Number | - | 是 | -
 * @returns {Date} data.createdAt - 创建时间 | Date | - | 是 | -
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'guide',
 *   data: { action: 'featured' }
 * })
 * // res.result = { code: 0, data: { _id: 'xxx', title: '...', ... } } // 或 data: null
 */
module.exports = async (event, context, { db }) => {
  const { data } = await db
    .collection('care_guides')
    .where({
      status: 'published',
      isFeatured: true,
    })
    .orderBy('createdAt', 'desc')
    .limit(1)
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

  if (!data || data.length === 0) {
    return { code: 0, data: null }
  }

  return { code: 0, data: data[0] }
}
