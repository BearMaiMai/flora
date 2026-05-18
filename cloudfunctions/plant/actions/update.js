const errorCodes = require('../../utils/error-codes')

/**
 * 更新植物信息
 * @param {String} id - 植物ID | - | String | plant-abc123 | 必填
 * @param {Object} [...updateData] - 扩展更新字段 | - | Object | - | 可选，含 nickname/location/imageUrl/status
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'plant',
 *   data: { action: 'update', id: 'plant-abc123', nickname: '新昵称' }
 * })
 */
module.exports = async (event, context, { db }) => {
  const { id, ...updateData } = event
  delete updateData.action
  if (!id) return errorCodes.MISSING_PARAM
  await db.collection('plants').doc(id).update({ data: { ...updateData, updatedAt: db.serverDate() } })
  return { code: 0, message: '更新成功' }
}
