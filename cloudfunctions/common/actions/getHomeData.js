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

  // 并行查询：所有已发布小贴士 + 所有花卉
  const [tipResult, recommendResult] = await Promise.all([
    db.collection('daily_tips').where({ isPublished: true }).get(),
    db.collection('flowers').get(),
  ])

  // 内存随机取1条小贴士
  const tipData = tipResult.data
  const tip = { data: tipData.length > 0 ? [tipData[Math.floor(Math.random() * tipData.length)]] : [] }

  // 内存随机取6条花卉（Fisher-Yates 洗牌后取前6条）
  const allFlowers = recommendResult.data.slice()
  for (let i = allFlowers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allFlowers[i], allFlowers[j]] = [allFlowers[j], allFlowers[i]]
  }
  const recommend = { data: allFlowers.slice(0, 6) }

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
