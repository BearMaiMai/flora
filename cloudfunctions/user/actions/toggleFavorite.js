// cloudfunctions/user/actions/toggleFavorite.js
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { flowerId } = event
  const _ = db.command

  const { data } = await db.collection('users').where({ _openid: openid }).get()
  if (!data.length) return { code: -1, message: '用户不存在' }

  const user = data[0]
  const isFav = user.favorites && user.favorites.includes(flowerId)

  await db.collection('users').doc(user._id).update({
    data: { favorites: isFav ? _.pull(flowerId) : _.push(flowerId) },
  })

  return { code: 0, data: { isFavorite: !isFav } }
}
