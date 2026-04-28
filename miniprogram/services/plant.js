/**
 * services/plant.js - 植物相关接口
 */
const { callFunction } = require('../utils/cloud')

const plantService = {
  /** 添加植物 */
  add(data) {
    return callFunction('plant', { action: 'add', ...data })
  },

  /** 获取我的植物列表 */
  getList() {
    return callFunction('plant', { action: 'list' })
  },

  /** 更新植物信息 */
  update(id, data) {
    return callFunction('plant', { action: 'update', id, ...data })
  },

  /** 删除植物 */
  remove(id) {
    return callFunction('plant', { action: 'remove', id })
  },
}

module.exports = plantService
