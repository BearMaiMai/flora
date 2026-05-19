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

  return {
    code: 0,
    data: {
      plantCount: plants.total,
      diaryCount: diaries.total,
      favoriteCount: users.data[0]?.favorites?.length || 0,
    },
  }
}