/**
 * services/diary.js - 日记相关接口
 */
const { callFunction } = require('../utils/cloud')

const diaryService = {
  /**
   * 添加植物生长日记
   * @param {Object} data - 日记信息
   * @param {String} data.plantId - 植物 ID（必填）
   * @param {String} data.content - 日记内容（必填）
   * @param {Array} [data.images=[]] - 图片 URL 数组
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Object} returns.data - 创建结果
   * @returns {String} returns.data._id - 新日记的 ID
   * @example
   * const res = await diaryService.add({
   *   plantId: 'plant-id-123',
   *   content: '今天给绿萝浇了水，叶子很绿',
   *   images: ['cloud://xxx.jpg']
   * })
   */
  add(data) {
    return callFunction('diary', { action: 'add', ...data })
  },

  /**
   * 获取日记列表
   * @param {String} [plantId] - 植物 ID（可选，不传则返回全部日记）
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Array} returns.data - 日记列表
   * @returns {String} returns.data[]._id - 日记 ID
   * @returns {String} returns.data[].plantId - 关联植物 ID
   * @returns {String} returns.data[].content - 日记内容
   * @returns {Array} returns.data[].images - 图片 URL 数组
   * @returns {Date} returns.data[].createdAt - 创建时间
   * @example
   * const res = await diaryService.getList('plant-id-123')
   * const res = await diaryService.getList()
   */
  getList(plantId) {
    return callFunction('diary', { action: 'list', plantId })
  },

  /**
   * 删除日记
   * @param {String} id - 日记 ID
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {String} returns.message - 提示信息
   * @example
   * const res = await diaryService.remove('diary-id-123')
   */
  remove(id) {
    return callFunction('diary', { action: 'delete', id })
  },
}

module.exports = diaryService
