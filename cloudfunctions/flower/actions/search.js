/**
 * 搜索花卉（按名称或别名模糊匹配）
 * @param {String} [keyword] - 搜索关键词 | - | String | 绿萝 | 可选，为空时返回空数组
 * @returns {Array} data - 匹配的花卉数组 | Array<Object> | - | category 已转为中文
 * @returns {String} data[].category - 分类名称 | String | - | 观叶植物,观花植物,多肉植物,果蔬植物,驱蚊植物
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'flower',
 *   data: { action: 'search', keyword: '绿萝' }
 * })
 */
module.exports = async (event, context, { db }) => {
  const { keyword = '' } = event
  if (!keyword.trim()) return { code: 0, data: [] }

  const { data } = await db.collection('flowers')
    .where(db.command.or([
      { name: db.RegExp({ regexp: keyword, options: 'i' }) },
      { alias: db.RegExp({ regexp: keyword, options: 'i' }) },
    ]))
    .limit(20)
    .get()

  const CATEGORY_MAP = {
    1: '观叶植物',
    2: '观花植物',
    3: '多肉植物',
    4: '果蔬',
    5: '驱蚊植物',
  }
  const normalizedData = data.map(item => ({
    ...item,
    category: CATEGORY_MAP[item.category] || '未分类',
  }))

  return { code: 0, data: normalizedData }
}
