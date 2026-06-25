/**
 * services/diary.js - 日记相关接口
 */
const { callFunction } = require('../utils/cloud')

const diaryService = {
  /** 添加日记
   * @param {Object} data
   * @param {String} data.plantId - 植物ID（必填）
   * @param {String} data.content - 内容（必填）
   * @param {Array<String>} [data.images] - 图片 fileID 列表
   * @param {String} [data.weather]
   * @param {String} [data.mood]
   */
  add(data) {
    return callFunction('diary', { action: 'add', ...data })
  },

  /** 获取日记列表（按时间倒序）
   * @param {String} [plantId] - 不传则查询当前用户全部
   */
  getList(plantId) {
    const params = { action: 'list' }
    if (plantId) params.plantId = plantId
    return callFunction('diary', params)
  },

  /** 获取日记详情 */
  getDetail(id) {
    return callFunction('diary', { action: 'detail', id })
  },

  /** 更新日记 */
  update(id, data) {
    return callFunction('diary', { action: 'update', id, ...data })
  },

  /** 删除日记 */
  remove(id) {
    return callFunction('diary', { action: 'delete', id })
  },
}

module.exports = diaryService
