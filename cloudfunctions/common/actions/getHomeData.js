// cloudfunctions/common/actions/getHomeData.js
module.exports = async (event, context, { db }) => {
  // 获取首页聚合数据
  const [tip, recommend] = await Promise.all([
    db.collection('daily_tips').orderBy('date', 'desc').limit(1).get(),
    db.collection('flowers').limit(6).get(),
  ])

  return {
    code: 0,
    data: {
      dailyTip: tip.data[0]?.content || '给花花浇点水吧 💧',
      recommendList: recommend.data,
    },
  }
}
