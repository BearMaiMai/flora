/**
 * services/diary.js - 日记相关接口
 */
const { callFunction } = require('../utils/cloud')

const diaryService = {
  /**
   * 添加植物生长日记
   * @param {Object} data - 日记信息 | - | - | 示例：- | 必填
   * @param {String} data.plantId - 植物 ID | - | - | 示例："plant-abc123" | 必填
   * @param {String} data.content - 日记内容 | - | - | 示例："今天给绿萝浇了水" | 必填
   * @param {Array} [data.images=[]] - 图片 URL 数组 | - | - | 示例：["cloud://xxx.jpg"] | 可选
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："添加成功"
   * @returns {Object} returns.data - 创建结果 | 示例：-
   * @returns {String} returns.data._id - 新日记的 ID | 示例："diary-abc123"
   */
  add(data) {
    return callFunction('diary', { action: 'add', ...data })
  },

  /**
   * 获取日记列表
   * @param {String} [plantId] - 植物 ID（可选，不传则返回全部日记） | - | - | 示例："plant-abc123" | 可选
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："success"
   * @returns {Object} returns.data - 日记列表数据 | 示例：-
   * @returns {Array} returns.data.list - 日记列表 | 示例：-
   * @returns {Number} returns.data.total - 总数 | 示例：10
   * @returns {String} returns.data.list[]._id - 日记 ID | 示例："diary-abc123"
   * @returns {String} returns.data.list[].plantId - 关联植物 ID | 示例："plant-abc123"
   * @returns {String} returns.data.list[].content - 日记内容 | 示例："今天给绿萝浇了水"
   * @returns {Array} returns.data.list[].images - 图片 URL 数组 | 示例：["cloud://xxx.jpg"]
   * @returns {String} returns.data.list[].createdAt - 创建时间 | 示例："2026-05-15 14:00"
   */
  getList(plantId) {
    return callFunction('diary', { action: 'list', plantId })
  },

  /**
   * 删除日记
   * @param {String} id - 日记 ID | - | - | 示例："diary-abc123" | 必填
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："删除成功"
   */
  remove(id) {
    return callFunction('diary', { action: 'delete', id })
  },
}

module.exports = diaryService
