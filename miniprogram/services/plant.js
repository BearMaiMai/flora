/**
 * services/plant.js - 植物相关接口
 */
const { callFunction } = require('../utils/cloud')

const plantService = {
  /**
   * 添加植物到我的花园
   * @param {Object} data - 植物信息 | - | - | - | 备注：必填字段见下
   * @param {String} data.flowerId - 花卉 ID（必填） | - | - | 示例："1" | 备注：关联花卉表
   * @param {String} [data.flowerName] - 花卉名称 | - | - | 示例："月季" | 备注：可选，不传则使用花卉表名称
   * @param {String} [data.nickname] - 昵称，默认使用花卉名称 | - | - | 示例："客厅的绿萝" | 备注：方便用户自定义
   * @param {String} [data.location] - 位置（如"客厅"） | - | - | 示例："客厅" | 备注：可选
   * @param {String} [data.imageUrl] - 照片 URL | - | - | 示例："" | 备注：可选，上传后获取
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："添加成功"
   * @returns {Object} returns.data - 创建结果 | 示例：-
   * @returns {String} returns.data._id - 新植物的 ID | 示例："1"
   * @example
   * const res = await plantService.add({
   *   flowerId: '1',
   *   nickname: '客厅的绿萝',
   *   location: '客厅'
   * })
   */
  add(data) {
    return callFunction('plant', { action: 'add', ...data })
  },

  /**
   * 获取我的植物列表
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："success"
   * @returns {Object} returns.data - 植物列表数据 | 示例：-
   * @returns {Array} returns.data.list - 植物列表 | 示例：-
   * @returns {Number} returns.data.total - 总数 | 示例：10
   * @returns {String} returns.data[]._id - 植物 ID | 示例："1"
   * @returns {String} returns.data[].flowerId - 关联花卉 ID | 示例："1"
   * @returns {String} returns.data[].flowerName - 花卉名称 | 示例："绿萝"
   * @returns {String} returns.data[].nickname - 昵称 | 示例："客厅的绿萝"
   * @returns {String} returns.data[].location - 位置 | 示例："客厅"
   * @returns {String} returns.data[].imageUrl - 照片 URL | 示例：""
   * @returns {String} returns.data[].status - 状态（healthy=健康） | 示例："healthy"
   * @example
   * const res = await plantService.getList()
   */
  getList() {
    return callFunction('plant', { action: 'list' })
  },

  /**
   * 更新植物信息
   * @param {String} id - 植物 ID | - | - | 示例："1" | 必填
   * @param {Object} data - 更新字段 | - | - | - | 备注：可选字段见下
   * @param {String} [data.nickname] - 昵称 | - | - | 示例："阳台的月季" | 备注：可选
   * @param {String} [data.location] - 位置 | - | - | 示例："阳台" | 备注：可选
   * @param {String} [data.imageUrl] - 照片 URL | - | - | 示例："" | 备注：可选
   * @param {String} [data.status] - 状态 | - | - | 示例："healthy" | 备注：可选
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："更新成功"
   * @example
   * const res = await plantService.update('1', { nickname: '阳台的月季' })
   */
  update(id, data) {
    return callFunction('plant', { action: 'update', id, ...data })
  },

  /**
   * 删除植物
   * @param {String} id - 植物 ID | - | - | 示例："1" | 必填
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："删除成功"
   * @example
   * const res = await plantService.remove('1')
   */
  remove(id) {
    return callFunction('plant', { action: 'remove', id })
  },
}

module.exports = plantService
