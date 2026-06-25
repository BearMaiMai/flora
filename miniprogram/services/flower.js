/**
 * services/flower.js - 花卉相关接口
 */
const { callFunction } = require('../utils/cloud')

const flowerService = {
  /** 获取花卉列表
   * @param {Object} params
   * @param {Number} [params.page=1]
   * @param {Number} [params.pageSize=20]
   * @param {String} [params.category] - 分类（可选）
   * @param {String} [params.keyword] - 搜索关键词（自动路由到 search action）
   */
  getList(params = {}) {
    // 有 keyword 时自动路由到 search 接口（后端 list 不支持 keyword）
    if (params && params.keyword) {
      return callFunction('flower', { action: 'search', keyword: params.keyword })
    }
    return callFunction('flower', { action: 'list', ...params })
  },

  /** 获取花卉详情 */
  getDetail(id) {
    return callFunction('flower', { action: 'detail', id })
  },

  /** 搜索花卉 */
  search(keyword) {
    return callFunction('flower', { action: 'search', keyword })
  },

  /** 获取推荐花卉 */
  getRecommend() {
    return callFunction('flower', { action: 'recommend' })
  },

  /** 获取分类列表（与对应数量） */
  getCategories() {
    return callFunction('flower', { action: 'getCategories' })
  },
}

module.exports = flowerService
