/**
 * services/plant.js - 植物相关接口
 */
const { callFunction } = require('../utils/cloud')

const plantService = {
  /** 添加植物
   * @param {Object} data
   * @param {String} data.flowerId    - 花卉ID（必填）
   * @param {String} data.flowerName  - 花卉名称（必填）
   * @param {String} data.nickname    - 昵称（必填）
   * @param {String} [data.location]  - 摆放位置
   * @param {String} [data.notes]     - 备注
   * @param {String} [data.purchaseDate]
   */
  add(data) {
    return callFunction('plant', { action: 'add', ...data })
  },

  /** 获取我的植物列表 */
  getList() {
    return callFunction('plant', { action: 'list' })
  },

  /** 获取植物详情（含日记摘要、提醒、对应花卉信息） */
  getDetail(id) {
    return callFunction('plant', { action: 'detail', id })
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
