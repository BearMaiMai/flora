/**
 * 获取用户统计数据（植物数、日记数、收藏数）
 * @returns {Number} data.plantCount - 植物数量 | ≥0 | 整数 | 5
 * @returns {Number} data.diaryCount - 日记数量 | ≥0 | 整数 | 12
 * @returns {Number} data.favoriteCount - 收藏数量 | ≥0 | 整数 | 3
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'user',
 *   data: { action: 'getStats' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID

  const [plants, diaries, users] = await Promise.all([
    db.collection('plants').where({ _openid: openid }).count(),
    db.collection('diaries').where({ _openid: openid }).count(),
    db.collection('users').where({ _openid: openid }).get(),
  ])

  // 收藏数需要与 getFavorites 保持一致：只统计真实存在的花卉（过滤掉已被删除的 stale ID）
  let favoriteCount = 0
  const favorites = users.data[0]?.favorites || []
  if (favorites.length > 0) {
    const { total } = await db.collection('flowers').where({
      _id: db.command.in(favorites)
    }).count()
    favoriteCount = total
  }

  return {
    code: 0,
    data: {
      plantCount: plants.total,
      diaryCount: diaries.total,
      favoriteCount,
    },
  }
}