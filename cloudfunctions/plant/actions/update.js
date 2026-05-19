const errorCodes = require('../utils/error-codes')

/**
 * 更新植物信息
 * @param {String} id - 植物ID | - | String | plant-abc123 | 必填
 * @param {String} [nickname] - 昵称 | - | String | 小绿 | 可选
 * @param {String} [location] - 放置位置 | - | String | 客厅窗台 | 可选
 * @param {String} [imageUrl] - 植物图片URL | - | String | cloud://xxx | 可选
 * @param {String} [status] - 状态 | - | String | healthy | 可选
 * @returns {String} message - 更新成功 | String | - | 更新成功
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
