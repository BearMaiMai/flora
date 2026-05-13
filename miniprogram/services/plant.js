/**
 * services/plant.js - 植物相关接口
 */
const { callFunction } = require('../utils/cloud')

const plantService = {
  /**
   * 添加植物到我的花园
   * @param {Object} data - 植物信息
   * @param {String} data.flowerId - 花卉 ID（必填）
   * @param {String} [data.flowerName] - 花卉名称
   * @param {String} [data.nickname] - 昵称，默认使用花卉名称
   * @param {String} [data.location] - 位置（如"客厅"）
   * @param {String} [data.imageUrl] - 照片 URL
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Object} returns.data - 创建结果
   * @returns {String} returns.data._id - 新植物的 ID
   * @example
   * const res = await plantService.add({
   *   flowerId: 'flower-id-123',
   *   nickname: '客厅的绿萝',
   *   location: '客厅'
   * })
   */
  add(data) {
    return callFunction('plant', { action: 'add', ...data })
  },

  /**
   * 获取我的植物列表
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Array} returns.data - 植物列表
   * @returns {String} returns.data[]._id - 植物 ID
   * @returns {String} returns.data[].flowerId - 关联花卉 ID
   * @returns {String} returns.data[].flowerName - 花卉名称
   * @returns {String} returns.data[].nickname - 昵称
   * @returns {String} returns.data[].location - 位置
   * @returns {String} returns.data[].imageUrl - 照片 URL
   * @returns {String} returns.data[].status - 状态（healthy=健康）
   * @returns {Date} returns.data[].createdAt - 创建时间
   * @returns {Date} returns.data[].updatedAt - 更新时间
   * @example
   * const res = await plantService.getList()
   */
  getList() {
    return callFunction('plant', { action: 'list' })
  },

  /**
   * 更新植物信息
   * @param {String} id - 植物 ID
   * @param {Object} data - 更新字段
   * @param {String} [data.nickname] - 昵称
   * @param {String} [data.location] - 位置
   * @param {String} [data.imageUrl] - 照片 URL
   * @param {String} [data.status] - 状态
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {String} returns.message - 提示信息
   * @example
   * const res = await plantService.update('plant-id-123', { nickname: '阳台的月季' })
   */
  update(id, data) {
    return callFunction('plant', { action: 'update', id, ...data })
  },

  /**
   * 删除植物
   * @param {String} id - 植物 ID
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {String} returns.message - 提示信息
   * @example
   * const res = await plantService.remove('plant-id-123')
   */
  remove(id) {
    return callFunction('plant', { action: 'remove', id })
  },
}

module.exports = plantService
