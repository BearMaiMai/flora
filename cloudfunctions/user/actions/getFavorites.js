/**
 * 获取用户收藏列表
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'user',
 *   data: { action: 'getFavorites' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { data: users } = await db.collection('users').where({ _openid: openid }).get()
  if (!users.length) return { code: 0, data: { list: [], total: 0 } }

  const favorites = users[0].favorites || []
  if (!favorites.length) return { code: 0, data: { list: [], total: 0 } }

  // 查询收藏的花卉详情
  const { data: flowerList } = await db.collection('flowers').where({
    _id: db.command.in(favorites)
  }).get()

  return {
    code: 0,
    data: {
      list: flowerList,
      total: flowerList.length
    }
  }
}
