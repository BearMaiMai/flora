/**
 * services/reminder.js - 提醒相关接口
 */
const { callFunction } = require('../utils/cloud')

const reminderService = {
  /** 获取提醒列表（默认返回未完成的提醒，按 nextRemindAt 升序）
   * 注意：后端目前不支持 filter/plantId 参数，前端需自行筛选
   */
  getList() {
    return callFunction('reminder', { action: 'list' })
  },

  /** 添加提醒
   * @param {Object} data
   * @param {String} data.plantId
   * @param {String} data.type - 浇水/施肥/换盆/其他
   * @param {Number} data.intervalDays - 间隔天数
   * @param {String} [data.firstTime] - ISO 时间字符串，首次提醒
   */
  add(data) {
    return callFunction('reminder', { action: 'add', ...data })
  },

  /** 完成提醒（自动生成下一次）
   * @param {String} id
   * @param {Number} [newIntervalDays] - 调整下次提醒间隔
   */
  complete(id, newIntervalDays) {
    const params = { action: 'complete', id }
    if (newIntervalDays !== undefined) params.newIntervalDays = newIntervalDays
    return callFunction('reminder', params)
  },

  /** 更新提醒（修改时间/间隔等） */
  update(id, data) {
    return callFunction('reminder', { action: 'update', id, ...data })
  },

  /** 删除提醒 */
  remove(id) {
    return callFunction('reminder', { action: 'delete', id })
  },
}

module.exports = reminderService
