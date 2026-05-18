const errorCodes = require('../../utils/error-codes')

/**
 * 删除日记
 * @param {String} id - 日记ID | - | String | diary-abc123 | 必填
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'diary',
 *   data: { action: 'delete', id: 'diary-abc123' }
 * })
 */
module.exports = async (event, context, { db }) => {
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM
  await db.collection('diaries').doc(id).remove()
  return { code: 0, message: '删除成功' }
}
