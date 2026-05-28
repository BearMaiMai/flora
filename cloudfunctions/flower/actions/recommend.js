/**
 * 获取推荐花卉（返回前6条，按数据库自然顺序）
 * @returns {Array} data - 推荐花卉数组 | Array<Object> | - | 6条花卉，category 已转为中文
 * @returns {String} data[].category - 分类名称 | String | - | 观叶植物,观花植物,多肉植物,果蔬植物,驱蚊植物
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'flower',
 *   data: { action: 'recommend' }
 * })
 */
module.exports = async (event, context, { db }) => {
  // TODO: 根据用户偏好推荐
  const CATEGORY_MAP = {
    1: '观叶植物',
    2: '观花植物',
    3: '多肉植物',
    4: '果蔬',
    5: '驱蚊植物',
  }
  const { data } = await db.collection('flowers').limit(6).get()
  const normalizedData = data.map(item => ({
    ...item,
    category: CATEGORY_MAP[item.category] || '未分类',
  }))
  return { code: 0, data: normalizedData }
}
