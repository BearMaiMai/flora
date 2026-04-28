// cloudfunctions/diary/actions/add.js
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { plantId, content, images = [] } = event

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
