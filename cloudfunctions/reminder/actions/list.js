/**
 * 获取提醒列表（待处理的提醒）
 * @returns {Array} data - 提醒对象数组 | Array<Object> | - | 含_id,plantId,type,title,nextRemindAt,isCompleted,intervalDays,isPushed,completedAt,createdAt
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'list' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { data } = await db.collection('reminders')
    .where({ _openid: openid, isCompleted: false })
    .orderBy('nextRemindAt', 'asc')
    .get()
  return { code: 0, data }
}