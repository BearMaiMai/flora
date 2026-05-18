const errorCodes = require('../../utils/error-codes')

/**
 * 修改提醒时间
 * @param {String} id - 提醒ID | - | String | reminder-abc123 | 必填
 * @param {String} nextRemindAt - 新提醒时间 | - | String | 2026-05-03T08:00:00.000Z | 必填
 * @returns {String} data.nextRemindAt - 更新后的提醒时间 | String | - | 2026-05-03T08:00:00.000Z
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'update', id: 'reminder-abc123', nextRemindAt: '2026-05-03T08:00:00.000Z' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { id, nextRemindAt } = event
  if (!id || !nextRemindAt) return errorCodes.MISSING_PARAM

  // 校验归属
  const { data } = await db.collection('reminders').doc(id).get()
  if (!data || data._openid !== openid) return errorCodes.DATA_NOT_FOUND

  await db.collection('reminders').doc(id).update({
    data: { nextRemindAt, updatedAt: db.serverDate() }
  })
  return { code: 0, data: { nextRemindAt } }
}
