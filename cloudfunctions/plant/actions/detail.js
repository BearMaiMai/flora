const errorCodes = require('../../utils/error-codes')

/**
 * 获取我的单棵植物详情
 * @param {String} id - 植物ID | - | String | plant-abc123 | 必填
 * @returns {String} data._id - 植物ID | String | - | plant-abc123
 * @returns {String} data.flowerId - 花卉ID | String | - | flower_001
 * @returns {String} data.nickName - 昵称 | String | - | 小绿
 * @returns {String} data.status - 状态 | String | - | healthy
 * @returns {String} data.location - 放置位置 | String | - | 客厅窗台
 * @returns {Number} data.waterDays - 浇水间隔天数 | Number | - | 5
 * @returns {Number} data.fertilizeDays - 施肥间隔天数 | Number | - | 20
 * @returns {String} data.lastWateredAt - 最后浇水时间 | String | - | 2026-04-28T08:00:00.000Z
 * @returns {String} data.lastFertilizedAt - 最后施肥时间 | String | - | 2026-04-10T08:00:00.000Z
 * @returns {String} data.createdAt - 创建时间 | String | - | 2026-03-01T10:00:00.000Z
 * @returns {String} data.updatedAt - 更新时间 | String | - | 2026-04-28T08:00:00.000Z
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'plant',
 *   data: { action: 'detail', id: 'plant-abc123' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM

  const { data } = await db.collection('plants').doc(id).get()
  if (!data || data._openid !== openid) return errorCodes.DATA_NOT_FOUND
  return { code: 0, data }
}
