// cloudfunctions/guide/index.js - 种植指南云函数入口
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

// 路由分发
const actions = {
  list: require('./actions/list'),
  detail: require('./actions/detail'),
  featured: require('./actions/featured'),
}

exports.main = async (event, context) => {
  const { action } = event

  if (!actions[action]) {
    return { code: -1, message: `未知操作: ${action}` }
  }

  try {
    return await actions[action](event, context, { db, cloud })
  } catch (err) {
    console.error(`[guide/${action}] 错误:`, err)
    return { code: -1, message: err.message || '服务器错误' }
  }
}
