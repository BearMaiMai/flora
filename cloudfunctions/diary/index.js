// cloudfunctions/diary/index.js - 成长日记云函数入口
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const actions = {
  add: require('./actions/add'),
  list: require('./actions/list'),
  delete: require('./actions/delete'),
}

exports.main = async (event, context) => {
  const { action } = event
  if (!actions[action]) return { code: -1, message: `未知操作: ${action}` }
  try {
    return await actions[action](event, context, { db, cloud })
  } catch (err) {
    console.error(`[diary/${action}] 错误:`, err)
    return { code: -1, message: err.message || '服务器错误' }
  }
}
