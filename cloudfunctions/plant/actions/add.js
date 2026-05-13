const errorCodes = require('../../utils/error-codes')

module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { flowerId, flowerName, nickname, location, imageUrl } = event

  if (!flowerId) return errorCodes.MISSING_PARAM

  const res = await db.collection('plants').add({
    data: {
      _openid: openid,
      flowerId,
      flowerName,
      nickname: nickname || flowerName,
      location: location || '',
      imageUrl: imageUrl || '',
      status: 'healthy',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate(),
    },
  })

  return { code: 0, data: { _id: res._id } }
}
