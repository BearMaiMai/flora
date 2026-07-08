const errorCodes = require('../utils/error-codes')

/**
 * 删除日记
 * @param {String} id - 日记ID | - | String | diary-abc123 | 必填
 * @returns {String} message - 删除成功 | String | - | 删除成功
 * @returns {Null} data - 无返回数据 | Null | - | null
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'diary',
 *   data: { action: 'delete', id: 'diary-abc123' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM
  const { data } = await db.collection('diaries').where({ _id: id, _openid: openid }).get()
  if (!data || !data.length) return errorCodes.NOT_FOUND
  await db.collection('diaries').doc(id).remove()
  return { code: 0, message: '删除成功' }
}
