/**
 * 获取提醒列表（待处理的提醒，自动关联植物位置信息）
 * @param {Boolean} [includeCompleted] - 是否包含已完成提醒 | includeCompleted | Boolean | true | 可选，默认 false 只返回未完成的
 * @returns {String} data[]._id - 提醒ID | String | - | reminder-abc123
 * @returns {String} data[].plantId - 植物ID | String | - | plant-abc123
 * @returns {String} data[].type - 提醒类型 | String | - | water / fertilize
 * @returns {String} data[].title - 提醒标题 | String | - | 给小绿浇水
 * @returns {String} data[].plantLocation - 植物摆放位置 | String | 客厅窗台 | 从关联 plants 集合读取；未设置则为空字符串
 * @returns {Number} data[].intervalDays - 间隔天数 | Number | - | 7
 * @returns {String} data[].nextRemindAt - 下次提醒时间 | String | - | 2026-06-04T10:00:00.000Z
 * @returns {Boolean} data[].isCompleted - 是否已完成 | Boolean | - | false
 * @returns {Boolean} data[].isPushed - 是否已推送 | Boolean | - | false
 * @returns {String} data[].createdAt - 创建时间 | String | - | 2026-05-01T08:00:00.000Z
 * @returns {String} data[].status - 提醒状态 | String | normal | normal=正常(绿),warning=即将到期(黄),overdue=已过期(红)
 * @example
 * // 获取未完成提醒
 * const res = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'list' }
 * })
 * // 获取全部提醒（含已完成）
 * const res2 = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'list', includeCompleted: true }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { includeCompleted } = event

  const where = { _openid: openid }
  if (!includeCompleted) {
    where.isCompleted = false
  }

  const { data } = await db.collection('reminders')
    .where(where)
    .orderBy('nextRemindAt', 'asc')
    .get()

  // 收集所有 plantId，批量查植物信息（获取 location）
  const plantIds = [...new Set(data.map(r => r.plantId).filter(Boolean))]
  let plantMap = {}
  if (plantIds.length > 0) {
    const _ = db.command
    const q = plantIds.length === 1
      ? db.collection('plants').where({ _id: plantIds[0] }).get()
      : db.collection('plants').where({ _id: _.in(plantIds) }).get()
    const plantRes = await q
    for (const plant of plantRes.data) {
      plantMap[plant._id] = plant
    }
  }

  // 计算每条提醒的状态 + 关联植物位置
  const now = new Date()
  const withStatus = data.map(item => {
    const next = new Date(item.nextRemindAt)
    const diffHours = (next - now) / (1000 * 60 * 60)
    let status = 'normal'
    if (diffHours < 0) status = 'overdue'
    else if (diffHours <= 24) status = 'warning'

    const plant = plantMap[item.plantId]
    return {
      ...item,
      status,
      plantLocation: (plant && plant.location) ? plant.location : '',
    }
  })

  return { code: 0, data: withStatus }
}