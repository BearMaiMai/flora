/**
 * 获取种植指南文章详情（阅读量+1）
 * @param {String} id - 文章ID | _id | - | - | care_guides 集合的 _id
 * @returns {Object} data - 文章完整对象 | Object | - | 是 | 含 _id,title,summary,category,content,coverImage,readTime,level,viewCount,createdAt,updatedAt
 * @returns {String} data._id - 文章ID | String | - | 是 | -
 * @returns {String} data.title - 文章标题 | String | - | 是 | -
 * @returns {String} data.summary - 文章摘要 | String | - | 是 | -
 * @returns {String} data.category - 文章分类 | String | - | 是 | 入门基础/浇水技巧/光照指南/施肥方案/病虫防治/换盆教程/修剪养护
 * @returns {String} data.content - 文章正文 | String | - | 是 | -
 * @returns {String} data.coverImage - 封面图云存储 fileID | String | - | 否 | -
 * @returns {Number} data.readTime - 阅读时长（分钟） | Number | - | 是 | -
 * @returns {String} data.level - 难度级别 | String | - | 是 | 入门/进阶/高级
 * @returns {Number} data.viewCount - 阅读量 | Number | - | 是 | -
 * @returns {Date} data.createdAt - 创建时间 | Date | - | 是 | -
 * @returns {Date} data.updatedAt - 更新时间 | Date | - | 否 | -
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'guide',
 *   data: { action: 'detail', id: 'abc123' }
 * })
 * // res.result = { code: 0, data: { _id: 'abc123', title: '...', ... } }
 */
module.exports = async (event, context, { db }) => {
  const { id } = event

  if (!id) {
    return { code: -1, message: '缺少文章ID' }
  }

  // 获取文章详情
  const { data } = await db.collection('care_guides').doc(id).get()

  if (!data || data.length === 0) {
    return { code: -1, message: '文章未找到' }
  }

  // 阅读量 +1（异步，不阻塞返回）
  db.collection('care_guides')
    .doc(id)
    .update({
      data: { viewCount: db.command.inc(1) },
    })
    .catch(err => {
      console.error('[guide/detail] 阅读量自增失败:', err)
    })

  return { code: 0, data: data[0] }
}
