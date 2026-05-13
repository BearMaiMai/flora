/**
 * services/reminder.js - 提醒相关接口
 */
const { callFunction } = require('../utils/cloud')

const reminderService = {
  /**
   * 获取提醒列表（待处理的提醒）
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Array} returns.data - 提醒列表
   * @returns {String} returns.data[]._id - 提醒 ID
   * @returns {String} returns.data[].plantId - 关联植物 ID
   * @returns {String} returns.data[].type - 提醒类型
   * @returns {Date} returns.data[].remindAt - 提醒时间
   * @returns {String} returns.data[].status - 状态（pending=待处理）
   * @example
   * const res = await reminderService.getList()
   */
  getList() {
    return callFunction('reminder', { action: 'list' })
  },

  /**
   * 完成提醒（标记为已完成）
   * @param {String} id - 提醒 ID
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {String} returns.message - 提示信息
   * @example
   * const res = await reminderService.complete('reminder-id-123')
   */
  complete(id) {
    return callFunction('reminder', { action: 'complete', id })
  },
}

module.exports = reminderService
