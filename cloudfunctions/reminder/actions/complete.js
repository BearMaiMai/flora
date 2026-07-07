const errorCodes = require('../utils/error-codes')

/**
 * 完成提醒（自动计算下次提醒时间）
 * 支持用户修改间隔天数：传 newIntervalDays 则更新植物的间隔配置，
 * 后续提醒按新间隔循环。不传则使用植物当前配置。
 * @param {String} id - 提醒ID | id | String | reminder-abc123 | 必填
 * @param {Number} [newIntervalDays] - 用户修改后的间隔天数 | newIntervalDays | Number | 10 | 可选，传了会更新 plants 集合的对应字段
 * @returns {Date} data.nextRemindAt - 下次提醒时间 | nextRemindAt | String | 2026-06-04T10:00:00.000Z
 * @returns {Number} data.intervalDays - 实际使用的间隔天数 | intervalDays | Number | 7
 * @example
 * // 前端调用示例（用户不修改间隔）
 * const res = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'complete', id: 'reminder-abc123' }
 * })
 * // 返回 { code: 0, data: { nextRemindAt: '2026-06-04T10:00:00.000Z', intervalDays: 7 } }
 *
 * // 前端调用示例（用户修改间隔为 10 天）
 * const res = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'complete', id: 'reminder-abc123', newIntervalDays: 10 }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { id, newIntervalDays } = event
  if (!id) return errorCodes.MISSING_PARAM

  // 1. 查出提醒详情，校验归属
  const { data: reminderArr } = await db.collection('reminders').where({ _id: id, _openid: openid }).get()
  if (!reminderArr || !reminderArr.length) return errorCodes.NOT_FOUND
  const reminder = reminderArr[0]

  const now = new Date()

  // 2. 如果前端传了新间隔，先更新 plants 集合
  if (newIntervalDays && reminder.plantId) {
    const field = reminder.type === 'water' ? 'waterInterval' : 'fertilizeInterval'
    await db.collection('plants').doc(reminder.plantId).update({
      data: { [field]: newIntervalDays, updatedAt: db.serverDate() }
    }).catch(e => {
      console.log('[reminder/complete] 更新植物间隔失败', e.message)
    })
  }

  // 3. 从 plants 集合读取最新间隔（含刚更新的）
  let actualIntervalDays = reminder.intervalDays // 兜底用原来的
  if (reminder.plantId) {
    try {
      const { data: plant } = await db.collection('plants').doc(reminder.plantId).get()
      if (plant) {
        const field = reminder.type === 'water' ? 'waterInterval' : 'fertilizeInterval'
        if (plant[field]) {
          actualIntervalDays = plant[field]
        }
      }
    } catch (e) {
      console.log('[reminder/complete] 读取植物间隔失败，使用原有 intervalDays', e.message)
    }
  }

  const nextTime = new Date(now.getTime() + actualIntervalDays * 24 * 60 * 60 * 1000)

  // 4. 标记完成，更新下次提醒时间（到期后 list 接口会自动恢复为待完成）
  await db.collection('reminders').doc(id).update({
    data: {
      intervalDays: actualIntervalDays, // 同步最新间隔到 reminders 记录
      nextRemindAt: nextTime,
      lastCompletedAt: db.serverDate(),
      isCompleted: true,
    },
  })

  // 5. 同步更新 plants 集合的最后操作时间
  if (reminder.plantId) {
    const updateField = reminder.type === 'water' ? 'lastWateredAt' : 'lastFertilizedAt'
    await db.collection('plants').doc(reminder.plantId).update({
      data: { [updateField]: db.serverDate(), updatedAt: db.serverDate() },
    }).catch(() => {})
  }

  return { code: 0, data: { nextRemindAt: nextTime.toISOString(), intervalDays: actualIntervalDays } }
}