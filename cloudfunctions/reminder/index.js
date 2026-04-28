// cloudfunctions/reminder/index.js - 养护提醒云函数入口
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const actions = {
  list: require('./actions/list'),
  complete: require('./actions/complete'),
  push: require('./actions/push'),
}

exports.main = async (event, context) => {
  const { action } = event
  if (!actions[action]) return { code: -1, message: `未知操作: ${action}` }
  try {
    return await actions[action](event, context, { db, cloud })
  } catch (err) {
    console.error(`[reminder/${action}] 错误:`, err)
    return { code: -1, message: err.message || '服务器错误' }
  }
}
