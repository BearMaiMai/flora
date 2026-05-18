const errorCodes = require('../../utils/error-codes')

/**
 * 添加提醒
 * @param {String} plantId - 植物ID | - | String | plant-abc123 | 必填
 * @param {String} type - 提醒类型 | water,fertilize | String | water | 必填
 * @param {String} title - 提醒标题 | - | String | 给小绿浇水 | 必填
 * @param {Number} intervalDays - 间隔天数 | 1~365 | Number | 5 | 必填
 * @param {String} [remindAt] - 提醒时间 | - | String | 2026-05-03T08:00:00.000Z | 可选，不传则自动计算
 * @returns {String} data._id - 新提醒ID | String | - | reminder-abc123
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'add', plantId: 'plant-abc123', type: 'water', title: '给小绿浇水', intervalDays: 5 }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { plantId, type, title, intervalDays, remindAt } = event
  if (!plantId || !type || !title || !intervalDays) return errorCodes.MISSING_PARAM

  const now = new Date()
  const nextRemindAt = remindAt || new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000).toISOString()

  const res = await db.collection('reminders').add({
    data: {
      _openid: openid,
      plantId,
      type,
      title,
      intervalDays,
      nextRemindAt,
      isCompleted: false,
      isPushed: false,
      completedAt: null,
      createdAt: db.serverDate(),
    },
  })

  return { code: 0, data: { _id: res._id } }
}
