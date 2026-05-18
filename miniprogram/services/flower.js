/**
 * services/flower.js - 花卉相关接口
 */
const { callFunction } = require('../utils/cloud')

const flowerService = {
  /** 获取花卉列表 */
  getList(params = {}) {
    return callFunction('flower', { action: 'list', ...params })
  },

  /** 获取花卉详情 */
  getDetail(id) {
    // 兼容云端历史版本参数：id / flowerId
    return callFunction('flower', { action: 'detail', id, flowerId: id })
  },

  /** 搜索花卉 */
  search(keyword) {
    return callFunction('flower', { action: 'search', keyword })
  },

  /** 获取推荐花卉 */
  getRecommend() {
    return callFunction('flower', { action: 'recommend' })
  },
}

module.exports = flowerService
