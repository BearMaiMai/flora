// cloudfunctions/common/actions/getDailyTip.js
module.exports = async (event, context, { db }) => {
  const { data } = await db.collection('daily_tips').orderBy('date', 'desc').limit(1).get()
  return { code: 0, data: data[0] || { content: '每天给花花一点爱 🌸' } }
}
