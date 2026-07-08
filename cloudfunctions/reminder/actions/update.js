const errorCodes = require('../utils/error-codes')

/**
 * 修改提醒（支持修改间隔天数或提醒时间）
 * @param {String} id - 提醒ID | - | String | reminder-abc123 | 必填
 * @param {Number} [intervalDays] - 新的间隔天数 | - | Number | 7 | 可选，传了则自动计算 nextRemindAt
 * @param {String} [nextRemindAt] - 新提醒时间 | - | String | 2026-05-03T08:00:00.000Z | 可选，与 intervalDays 二选一
 * @returns {String} data.nextRemindAt - 更新后的提醒时间 | String | - | 2026-05-03T08:00:00.000Z
 * @returns {Number} data.intervalDays - 更新后的间隔天数 | Number | - | 7
 * @example
 * // 修改间隔天数（自动计算下次提醒时间）
 * const res = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'update', id: 'reminder-abc123', intervalDays: 7 }
 * })
 * // 修改具体提醒时间
 * const res = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'update', id: 'reminder-abc123', nextRemindAt: '2026-05-03T08:00:00.000Z' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { id, intervalDays, nextRemindAt } = event
  if (!id) return errorCodes.MISSING_PARAM

  // 至少传 intervalDays 或 nextRemindAt 之一
  if (!intervalDays && !nextRemindAt) return errorCodes.MISSING_PARAM

  // 校验归属
  const { data } = await db.collection('reminders').where({ _id: id, _openid: openid }).get()
  if (!data || !data.length) return errorCodes.DATA_NOT_FOUND
  const itemData = data[0]

  // 如果传了 intervalDays，自动计算 nextRemindAt
  let finalNextRemindAt = nextRemindAt
  let finalIntervalDays = intervalDays
  if (intervalDays && !nextRemindAt) {
    const now = new Date()
    finalNextRemindAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000).toISOString()
  }
  if (!finalIntervalDays) finalIntervalDays = itemData.intervalDays

  await db.collection('reminders').doc(id).update({
    data: {
      intervalDays: finalIntervalDays,
      nextRemindAt: finalNextRemindAt,
      updatedAt: db.serverDate()
    }
  })
  return { code: 0, data: { nextRemindAt: finalNextRemindAt, intervalDays: finalIntervalDays } }
}
