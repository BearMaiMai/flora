/**
 * 获取用户收藏列表
 * @returns {Array} data.list - 收藏花卉数组 | Array<Object> | - | -
 * @returns {Number} data.total - 收藏总数 | ≥0 | 整数 | -
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
      total: flowerList.length  // 与列表保持一致，过滤掉已删除的花卉ID
    }
  }
}