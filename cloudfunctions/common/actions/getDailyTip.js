/**
 * 获取每日养花小贴士
 * @returns {String} data.content - 贴士内容 | String | 每日养花技巧 | 绿萝喜欢湿润环境，夏季可每天浇水... | 从 daily_tips 集合读取最新一条
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'common',
 *   data: { action: 'getDailyTip' }
 * })
 */
module.exports = async (event, context, { db }) => {
  const { data } = await db.collection('daily_tips').orderBy('date', 'desc').limit(1).get()
  return { code: 0, data: data[0] || { content: '每天给花花一点爱 🌸' } }
}
