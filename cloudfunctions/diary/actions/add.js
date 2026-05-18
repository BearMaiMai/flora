const errorCodes = require('../../utils/error-codes')

/**
 * 添加植物生长日记
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'diary',
 *   data: { action: 'add', plantId: 'plant-abc123', content: '今天给绿萝浇了水', images: [] }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { plantId, content, images = [] } = event

  if (!plantId || !content) return errorCodes.MISSING_PARAM

  const res = await db.collection('diaries').add({
    data: {
      _openid: openid,
      plantId,
      content,
      images,
      createdAt: db.serverDate(),
    },
  })

  return { code: 0, data: { _id: res._id } }
}
