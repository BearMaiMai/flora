// cloudfunctions/user/index.js - 用户管理云函数入口
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const rateLimit = require('./utils/rate-limit')

const actions = {
  login: require('./actions/login'),
  updateInfo: require('./actions/updateInfo'),
  toggleFavorite: require('./actions/toggleFavorite'),
  getFavorites: require('./actions/getFavorites'),
  getStats: require('./actions/getStats'),
  feedback: require('./actions/feedback'),
  logout: require('./actions/logout'),
}

exports.main = async (event, context) => {
  const { action } = event
  if (!actions[action]) return { code: -1, message: `未知操作: ${action}` }
  try {
    // 频率限制（写操作限流）
    if (['updateInfo', 'toggleFavorite', 'feedback'].includes(action)) {
      const openid = cloud.getWXContext().OPENID
      const { allowed } = rateLimit(openid, `user:${action}`, { maxCalls: 5, windowMs: 1000 })
      if (!allowed) return { code: -1, message: '操作太频繁，请稍后再试' }
    }
    return await actions[action](event, context, { db, cloud })
  } catch (err) {
    console.error(`[user/${action}] 错误:`, err)
    return { code: -1, message: err.message || '服务器错误' }
  }
}
