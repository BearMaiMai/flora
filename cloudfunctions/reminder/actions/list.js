/**
 * 获取提醒列表（待处理的提醒）
 * @returns {String} data[]._id - 提醒ID | String | - | reminder-abc123
 * @returns {String} data[].plantId - 植物ID | String | - | plant-abc123
 * @returns {String} data[].type - 提醒类型 | String | - | water / fertilize
 * @returns {String} data[].title - 提醒标题 | String | - | 给小绿浇水
 * @returns {Number} data[].intervalDays - 间隔天数 | Number | - | 7
 * @returns {String} data[].nextRemindAt - 下次提醒时间 | String | - | 2026-06-04T10:00:00.000Z
 * @returns {Boolean} data[].isCompleted - 是否已完成 | Boolean | - | false
 * @returns {Boolean} data[].isPushed - 是否已推送 | Boolean | - | false
 * @returns {String} data[].createdAt - 创建时间 | String | - | 2026-05-01T08:00:00.000Z
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