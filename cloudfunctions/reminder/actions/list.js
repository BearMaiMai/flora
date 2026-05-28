/**
 * 获取提醒列表（待处理的提醒）
 * @returns {Array} data - 提醒对象数组 | Array<Object> | - | 含_id,plantId,type,title,nextRemindAt,isCompleted,intervalDays,isPushed,completedAt,createdAt,status
 * @returns {String} data[].status - 提醒状态 | String | normal | normal=正常(绿),warning=即将到期(黄),overdue=已过期(红)
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

  // 计算每条提醒的状态（normal / warning / overdue）
  const now = new Date()
  const withStatus = data.map(item => {
    const next = new Date(item.nextRemindAt)
    const diffHours = (next - now) / (1000 * 60 * 60)
    let status = 'normal'
    if (diffHours < 0) status = 'overdue'
    else if (diffHours <= 24) status = 'warning'
    return { ...item, status }
  })

  return { code: 0, data: withStatus }
}