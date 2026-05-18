/**
 * 获取提醒列表（待处理的提醒）
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'list' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { data } = await db.collection('reminders')
    .where({ _openid: openid, status: 'pending' })
    .orderBy('remindAt', 'asc')
    .get()
  return { code: 0, data }
}
