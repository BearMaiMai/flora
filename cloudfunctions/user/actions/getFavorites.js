// cloudfunctions/user/actions/getFavorites.js
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { data: users } = await db.collection('users').where({ _openid: openid }).get()
  if (!users.length) return { code: 0, data: [] }

  const favorites = users[0].favorites || []
  if (!favorites.length) return { code: 0, data: [] }

  // TODO: 查询收藏的花卉详情
  return { code: 0, data: favorites }
}
