/**
 * 搜索花卉（按名称或别名模糊匹配）
 * @param {String} [keyword] - 搜索关键词 | - | String | 绿萝 | 可选，为空时返回空数组
 * @returns {Array} data - 匹配的花卉数组 | Array<Object> | - | -
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

  return { code: 0, data }
}
