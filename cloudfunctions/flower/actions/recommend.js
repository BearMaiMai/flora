/**
 * 获取推荐花卉（返回前6条，按数据库自然顺序）
 * @returns {Array} data - 推荐花卉数组 | Array<Object> | - | 6条花卉，字段同 flowers 集合
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'flower',
 *   data: { action: 'recommend' }
 * })
 */
module.exports = async (event, context, { db }) => {
  // TODO: 根据用户偏好推荐
  const { data } = await db.collection('flowers').limit(6).get()
  return { code: 0, data }
}
