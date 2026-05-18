const errorCodes = require('../../utils/error-codes')

/**
 * 编辑日记
 * @param {String} id - 日记ID | - | String | diary-abc123 | 必填
 * @param {String} [content] - 日记内容 | - | String | 今天给绿萝浇了水 | 可选
 * @param {Array} [images] - 图片列表 | - | Array<String> | [] | 可选
 * @returns {String} data.content - 日记内容 | String | - | 今天给绿萝浇了水
 * @returns {Array} data.images - 图片列表 | Array<String> | - | -
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'diary',
 *   data: { action: 'update', id: 'diary-abc123', content: '更新后的内容' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { id, content, images } = event
  if (!id) return errorCodes.MISSING_PARAM

  // 校验归属
  const { data } = await db.collection('diaries').doc(id).get()
  if (!data || data._openid !== openid) return errorCodes.DATA_NOT_FOUND

  const updateData = {}
  if (content !== undefined) updateData.content = content
  if (images !== undefined) updateData.images = images
  updateData.updatedAt = db.serverDate()

  await db.collection('diaries').doc(id).update({ data: updateData })
  return { code: 0, data: { ...data, ...updateData } }
}
