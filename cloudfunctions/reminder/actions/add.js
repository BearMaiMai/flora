const errorCodes = require('../utils/error-codes')

/**
 * 添加提醒
 * intervalDays 为可选参数，不传则自动从 plants 集合读取对应植物的
 * waterInterval（type=water）或 fertilizeInterval（type=fertilize）。
 * @param {String} plantId - 植物ID | plantId | String | plant-abc123 | 必填
 * @param {String} type - 提醒类型 | type | String | water / fertilize | 必填
 * @param {String} title - 提醒标题 | title | String | 给小绿浇水 | 必填
 * @param {Number} [intervalDays] - 间隔天数 | intervalDays | Number | 7 | 可选，不传则自动从 plants 集合读取
 * @param {String} [remindAt] - 首次提醒时间 | remindAt | String | 2026-05-03T08:00:00.000Z | 可选，不传则按当前时间+间隔天数自动计算
 * @returns {String} data._id - 新提醒ID | _id | String | reminder-abc123
 * @returns {Number} data.intervalDays - 实际使用的间隔天数 | intervalDays | Number | 7
 * @example
 * // 推荐调用方式：不传 intervalDays，由后端自动读取
 * const res = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'add', plantId: 'plant-abc123', type: 'water', title: '给小绿浇水' }
 * })
 * // 返回 { code: 0, data: { _id: 'reminder-xxx', intervalDays: 7 } }
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { plantId, type, title, intervalDays, remindAt } = event
  if (!plantId || !type || !title) return errorCodes.MISSING_PARAM

  // intervalDays 为可选参数，不传则自动从 plants 集合读取
  let finalIntervalDays = intervalDays
  if (!finalIntervalDays && plantId) {
    try {
      const { data: plant } = await db.collection('plants').doc(plantId).get()
      if (plant) {
        const field = type === 'water' ? 'waterInterval' : 'fertilizeInterval'
        if (plant[field]) {
          finalIntervalDays = plant[field]
        }
      }
    } catch (e) {
      console.log('[reminder/add] 读取植物间隔失败，将使用默认值', e.message)
    }
  }

  // 兜底默认值
  if (!finalIntervalDays) {
    finalIntervalDays = type === 'water' ? 7 : 30
  }

  const now = new Date()
  const nextRemindAt = remindAt || new Date(now.getTime() + finalIntervalDays * 24 * 60 * 60 * 1000).toISOString()

  const res = await db.collection('reminders').add({
    data: {
      _openid: openid,
      plantId,
      type,
      title,
      intervalDays: finalIntervalDays,
      nextRemindAt,
      isCompleted: false,
      isPushed: false,
      completedAt: null,
      createdAt: db.serverDate(),
    },
  })

  return { code: 0, data: { _id: res._id, intervalDays: finalIntervalDays } }
}
