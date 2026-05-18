/**
 * 获取花卉列表（支持分页和分类筛选）
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'flower',
 *   data: { action: 'list', page: 1, pageSize: 20, category: 2 }
 * })
 */
module.exports = async (event, context, { db }) => {
  const { page = 1, pageSize = 20, category } = event
  const skip = (page - 1) * pageSize

  let query = db.collection('flowers')
  if (category !== undefined && category !== '') {
    query = query.where({ category: Number(category) })
  }

  const { data } = await query
    .skip(skip)
    .limit(pageSize)
    .orderBy('name', 'asc')
    .get()

  return { code: 0, data }
}
