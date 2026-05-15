const errorCodes = require('../../utils/error-codes')

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
