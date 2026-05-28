/**
 * 获取推荐花卉（随机返回6条）
 * @returns {Array} data - 推荐花卉数组 | Array<Object> | - | 6条花卉，category 已转为中文
 * @returns {String} data[].category - 分类名称 | String | - | 观叶植物,观花植物,多肉植物,果蔬植物,驱蚊植物
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'flower',
 *   data: { action: 'recommend' }
 * })
 */
module.exports = async (event, context, { db }) => {
  const CATEGORY_MAP = {
    1: '观叶植物',
    2: '观花植物',
    3: '多肉植物',
    4: '果蔬',
    5: '驱蚊植物',
  }
  const { data: allData } = await db.collection('flowers').get()
  // 内存随机取6条（Fisher-Yates 洗牌）
  const data = allData.slice()
  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]]
  }
  const picked = data.slice(0, 6)
  const normalizedData = picked.map(item => ({
    ...item,
    category: CATEGORY_MAP[item.category] || '未分类',
  }))
  return { code: 0, data: normalizedData }
}
