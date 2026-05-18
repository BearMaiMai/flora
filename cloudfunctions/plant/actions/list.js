/**
 * 获取我的植物列表
 * @returns {Array} data - 植物对象数组 | Array<Object> | - | 含所有植物字段
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'plant',
 *   data: { action: 'list' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { data } = await db.collection('plants')
    .where({ _openid: openid })
    .orderBy('createdAt', 'desc')
    .get()
  return { code: 0, data }
}
