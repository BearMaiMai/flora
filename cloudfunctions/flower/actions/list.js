/**
 * 获取花卉列表（支持分页和分类筛选）
 * @param {Number} page - 页码 | 1~100 | 整数 | 1 | 默认第1页
 * @param {Number} pageSize - 每页数量 | 1~100 | 整数 | 20 | 默认20条
 * @param {Number} [category] - 分类ID | 1~4 | 整数 | 2 | 1=观叶,2=观花,3=多肉,4=果蔬；不传则返回全部分类
 * @returns {Array} data.list - 花卉对象数组 | Array<Object> | - | 是 | -
 * @returns {Number} data.total - 符合条件的总数 | ≥0 | 整数 | 100 | 是 | -
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

  const countRes = await query.count()
  const { data } = await query
    .skip(skip)
    .limit(pageSize)
    .orderBy('name', 'asc')
    .get()

  return { code: 0, data: { list: data, total: countRes.total } }
}
