/**
 * 获取首页聚合数据（每日贴士 + 推荐花草）
 * @returns {String} data.dailyTip - 每日贴士内容 | String | 今日养花小贴士 | 绿萝喜欢湿润环境... | 从 daily_tips 集合读取
 * @returns {Array} data.recommendList - 推荐花卉数组 | Array<Object> | - | [{"_id":"flower_001","name":"绿萝",...}] | 6条花卉，category 字段已转为中文名称
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'common',
 *   data: { action: 'getHomeData' }
 * })
 */
module.exports = async (event, context, { db }) => {
  const CATEGORY_MAP = {
    1: '观叶植物',
    2: '观花植物',
    3: '多肉植物',
    4: '果蔬',
    5: '驱蚊植物',
  }
  const [tip, recommend] = await Promise.all([
    db.collection('daily_tips').orderBy('date', 'desc').limit(1).get(),
    db.collection('flowers').limit(6).get(),
  ])

  const recommendList = recommend.data.map(item => ({
    ...item,
    category: CATEGORY_MAP[item.category] || '未分类',
  }))

  return {
    code: 0,
    data: {
      dailyTip: tip.data[0]?.content || '给花花浇点水吧 💧',
      recommendList,
    },
  }
}
