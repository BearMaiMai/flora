/**
 * services/reminder.js - 提醒相关接口
 */
const { callFunction } = require('../utils/cloud')

const reminderService = {
  /** 获取提醒列表 */
  getList() {
    return callFunction('reminder', { action: 'list' })
  },

  /** 完成提醒 */
  complete(id) {
    return callFunction('reminder', { action: 'complete', id })
  },
}

module.exports = reminderService
