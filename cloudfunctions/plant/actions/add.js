// cloudfunctions/plant/actions/add.js
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { flowerId, flowerName, nickname, location, imageUrl } = event

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
