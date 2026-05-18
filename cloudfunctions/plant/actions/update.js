const errorCodes = require('../../utils/error-codes')

/**
 * 更新植物信息
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'plant',
 *   data: { action: 'update', id: 'plant-abc123', nickname: '新昵称', location: '阳台' }
 * })
 */
module.exports = async (event, context, { db }) => {
  const { id, ...updateData } = event
  delete updateData.action
  if (!id) return errorCodes.MISSING_PARAM
  await db.collection('plants').doc(id).update({ data: { ...updateData, updatedAt: db.serverDate() } })
  return { code: 0, message: '更新成功' }
}
