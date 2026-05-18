/**
 * 获取推荐花卉（随机返回6条）
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'flower',
 *   data: { action: 'recommend' }
 * })
 */
module.exports = async (event, context, { db }) => {
  // TODO: 根据用户偏好推荐，暂时随机返回
  const { data } = await db.collection('flowers').limit(6).get()
  return { code: 0, data }
}
