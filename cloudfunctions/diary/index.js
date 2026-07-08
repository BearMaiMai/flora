// cloudfunctions/diary/index.js - 成长日记云函数入口
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const rateLimit = require('./utils/rate-limit')

const actions = {
  add: require('./actions/add'),
  list: require('./actions/list'),
  detail: require('./actions/detail'),
  update: require('./actions/update'),
  delete: require('./actions/delete'),
}

exports.main = async (event, context) => {
  const { action } = event
  if (!actions[action]) return { code: -1, message: `未知操作: ${action}` }
  try {
    // 频率限制（写操作：每秒最多3次）
    if (['add', 'update', 'delete'].includes(action)) {
      const openid = cloud.getWXContext().OPENID
      const { allowed } = rateLimit(openid, `diary:${action}`, { maxCalls: 3, windowMs: 1000 })
      if (!allowed) return { code: -1, message: '操作太频繁，请稍后再试' }
    }
    return await actions[action](event, context, { db, cloud })
  } catch (err) {
    console.error(`[diary/${action}] 错误:`, err)
    return { code: -1, message: err.message || '服务器错误' }
  }
}
