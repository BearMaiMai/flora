const errorCodes = require('../../utils/error-codes')

/**
 * 删除我的植物
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
