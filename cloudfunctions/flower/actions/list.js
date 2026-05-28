/**
 * 获取花卉列表（支持分页和分类筛选）
 * @param {Number} page - 页码 | 1~100 | 整数 | 1 | 默认第1页
 * @param {Number} pageSize - 每页数量 | 1~100 | 整数 | 20 | 默认20条
 * @param {Number} [category] - 分类ID | 1~5 | 整数 | 2 | 1=观叶植物,2=观花植物,3=多肉植物,4=果蔬,5=驱蚊植物；不传则返回全部分类
 * @returns {Array} data - 花卉对象数组 | Array<Object> | - | 是 | -
 * @returns {String} data[].category - 分类名称 | String | 观花植物 | 1=观叶,2=观花,3=多肉,4=果蔬,5=驱蚊
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

  // 把 category 数字映射成中文
  const CATEGORY_MAP = {
    1: '观叶植物',
    2: '观花植物',
    3: '多肉植物',
    4: '果蔬',
    5: '驱蚊植物',
  }
  const normalizedData = data.map(item => ({
    ...item,
    category: CATEGORY_MAP[item.category] || '未分类'
  }))

  return { code: 0, data: normalizedData }
}
