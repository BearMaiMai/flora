/**
 * 获取首页聚合数据（每日贴士 + 推荐花草）
 * @returns {String} data.dailyTip - 每日贴士内容 | String | - | - | 今日养花小贴士
 * @returns {Array} data.recommendList - 推荐花卉数组 | Array<Object> | - | - | 6条随机花卉
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'common',
 *   data: { action: 'getHomeData' }
 * })
 */
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
