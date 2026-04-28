/**
 * services/diary.js - 日记相关接口
 */
const { callFunction } = require('../utils/cloud')

const diaryService = {
  /** 添加日记 */
  add(data) {
    return callFunction('diary', { action: 'add', ...data })
  },

  /** 获取日记列表 */
  getList(plantId) {
    return callFunction('diary', { action: 'list', plantId })
  },

  /** 删除日记 */
  remove(id) {
    return callFunction('diary', { action: 'delete', id })
  },
}

module.exports = diaryService
