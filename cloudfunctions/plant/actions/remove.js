const errorCodes = require('../utils/error-codes')

/**
 * 删除我的植物
 * @param {String} id - 植物ID | - | String | plant-abc123 | 必填
 * @returns {String} message - 删除成功 | String | - | 删除成功
 * @returns {Null} data - 无返回数据 | Null | - | null
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'plant',
 *   data: { action: 'remove', id: 'plant-abc123' }
 * })
 */
module.exports = async (event, context, { db }) => {
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM
  await db.collection('plants').doc(id).remove()
  return { code: 0, message: '删除成功', data: null }
}
