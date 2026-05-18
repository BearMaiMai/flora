const errorCodes = require('../../utils/error-codes')

/**
 * 完成提醒（标记为已完成）
 * @param {String} id - 提醒ID | - | String | reminder-abc123 | 必填
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'complete', id: 'reminder-abc123' }
 * })
 */
module.exports = async (event, context, { db }) => {
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM
  await db.collection('reminders').doc(id).update({
    data: { status: 'completed', completedAt: db.serverDate() },
  })
  return { code: 0, message: '已完成' }
}