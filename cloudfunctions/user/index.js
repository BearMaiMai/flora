// cloudfunctions/user/index.js - 用户管理云函数入口
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const actions = {
  login: require('./actions/login'),
  updateInfo: require('./actions/updateInfo'),
  toggleFavorite: require('./actions/toggleFavorite'),
  getFavorites: require('./actions/getFavorites'),
  getStats: require('./actions/getStats'),
}

exports.main = async (event, context) => {
  const { action } = event
  if (!actions[action]) return { code: -1, message: `未知操作: ${action}` }
  try {
    return await actions[action](event, context, { db, cloud })
  } catch (err) {
    console.error(`[user/${action}] 错误:`, err)
    return { code: -1, message: err.message || '服务器错误' }
  }
}
