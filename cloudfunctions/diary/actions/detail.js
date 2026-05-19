const errorCodes = require('../utils/error-codes')

/**
 * 获取单条日记详情
 * @param {String} id - 日记ID | - | String | diary-abc123 | 必填
 * @returns {String} data._id - 日记ID | String | - | diary-abc123
 * @returns {String} data.plantId - 植物ID | String | - | plant-abc123
 * @returns {String} data.content - 日记内容 | String | - | 今天给绿萝浇了水
 * @returns {Array} data.images - 图片列表 | Array<String> | - | -
 * @returns {Object} data.createdAt - 创建时间 | Object | - | 服务端时间对象
 * @returns {Object} data.updatedAt - 更新时间（编辑后才有） | Object | - | 服务端时间对象
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'diary',
 *   data: { action: 'detail', id: 'diary-abc123' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM

  const { data } = await db.collection('diaries').doc(id).get()
  if (!data || data._openid !== openid) return errorCodes.DATA_NOT_FOUND
  return { code: 0, data }
}
