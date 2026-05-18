const errorCodes = require('../../utils/error-codes')

/**
 * 删除提醒
 * @param {String} id - 提醒ID | - | String | reminder-abc123 | 必填
 * @returns {Null} data - 无返回数据 | Null | - | -
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'delete', id: 'reminder-abc123' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM

  // 校验归属
  const { data } = await db.collection('reminders').doc(id).get()
  if (!data || data._openid !== openid) return errorCodes.DATA_NOT_FOUND

  await db.collection('reminders').doc(id).remove()
  return { code: 0, message: '删除成功', data: null }
}
