/**
 * services/reminder.js - 提醒相关接口
 */
const { callFunction } = require('../utils/cloud')

const reminderService = {
  /**
   * 获取提醒列表（待处理的提醒）
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："success"
   * @returns {Object} returns.data - 提醒列表数据 | 示例：-
   * @returns {Array} returns.data.list - 提醒列表 | 示例：-
   * @returns {Number} returns.data.total - 总数 | 示例：5
   * @returns {String} returns.data.list[]._id - 提醒 ID | 示例："reminder-abc123"
   * @returns {String} returns.data.list[].plantId - 关联植物 ID | 示例："plant-abc123"
   * @returns {String} returns.data.list[].type - 提醒类型 | 示例："water"
   * @returns {String} returns.data.list[].remindAt - 提醒时间 | 示例："2026-05-20 09:00"
   * @returns {String} returns.data.list[].status - 状态（pending=待处理） | 示例："pending"
   * @example
   * const res = await reminderService.getList()
   */
  getList() {
    return callFunction('reminder', { action: 'list' })
  },

  /**
   * 完成提醒（标记为已完成）
   * @param {String} id - 提醒 ID | - | - | 示例："reminder-abc123" | 必填
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："已完成"
   * @example
   * const res = await reminderService.complete('reminder-abc123')
   */
  complete(id) {
    return callFunction('reminder', { action: 'complete', id })
  },
}

module.exports = reminderService
