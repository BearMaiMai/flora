/**
 * 获取日记列表（可按植物筛选）
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'diary',
 *   data: { action: 'list', plantId: 'plant-abc123' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { plantId } = event

  let query = db.collection('diaries').where({ _openid: openid })
  if (plantId) query = query.where({ plantId })

  const { data } = await query.orderBy('createdAt', 'desc').limit(50).get()
  return { code: 0, data }
}
