const errorCodes = require('../../utils/error-codes')

module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { flowerId } = event
  const _ = db.command

  const { data } = await db.collection('users').where({ _openid: openid }).get()
  if (!data.length) return errorCodes.USER_NOT_FOUND

  const user = data[0]
  const isFav = user.favorites && user.favorites.includes(flowerId)

  await db.collection('users').doc(user._id).update({
    data: { favorites: isFav ? _.pull(flowerId) : _.push(flowerId) },
  })

  return { code: 0, data: { isFavorite: !isFav } }
}
