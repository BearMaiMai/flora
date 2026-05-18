const errorCodes = require('../../utils/error-codes')

/**
 * 获取花卉详情
 * @param {String} id - 花卉ID | - | String | flower_001 | 必填
 * @returns {Object} data - 花卉对象 | Object | - | 含所有花卉字段
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'flower',
 *   data: { action: 'detail', id: 'flower_001' }
 * })
 */
module.exports = async (event, context, { db }) => {
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM

  const { data } = await db.collection('flowers').doc(id).get()
  return { code: 0, data }
}
