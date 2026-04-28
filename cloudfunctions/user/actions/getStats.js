// cloudfunctions/user/actions/getStats.js
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
