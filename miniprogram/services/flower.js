/**
 * services/flower.js - 花卉相关接口
 */
const { callFunction } = require('../utils/cloud')

const flowerService = {
  /**
   * 获取花卉列表（支持分页和分类筛选）
   * @param {Object} params - 查询参数
   * @param {Number} [params.page=1] - 页码，默认 1
   * @param {Number} [params.pageSize=20] - 每页数量，默认 20
   * @param {Number} [params.category] - 分类筛选（1=观叶 2=观花 3=多肉 4=果蔬）
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Array} returns.data - 花卉列表
   * @returns {String} returns.data[]._id - 花卉 ID
   * @returns {String} returns.data[].name - 花卉名称
   * @returns {Array} returns.data[].alias - 别名数组
   * @returns {Number} returns.data[].category - 分类（1=观叶 2=观花 3=多肉 4=果蔬）
   * @returns {Number} returns.data[].difficulty - 养护难度（1-5）
   * @returns {String} returns.data[].coverImage - 封面图 URL
   * @returns {String} returns.data[].description - 描述
   * @example
   * const res = await flowerService.getList({ page: 1, pageSize: 20 })
   * const res = await flowerService.getList({ category: 2 })
   */
  getList(params = {}) {
    // 确保 category 是数字类型
    if (params.category !== undefined) {
      params.category = Number(params.category)
    }
    return callFunction('flower', { action: 'list', ...params })
  },

  /**
   * 获取花卉详情
   * @param {String} id - 花卉 ID
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Object} returns.data - 花卉详情
   * @returns {String} returns.data._id - 花卉 ID
   * @returns {String} returns.data.name - 花卉名称
   * @returns {Array} returns.data.alias - 别名数组
   * @returns {Number} returns.data.category - 分类（1=观叶 2=观花 3=多肉 4=果蔬）
   * @returns {Number} returns.data.difficulty - 养护难度（1-5）
   * @returns {Number} returns.data.waterDays - 浇水间隔天数
   * @returns {Number} returns.data.fertilizeDays - 施肥间隔天数
   * @returns {String} returns.data.light - 光照需求
   * @returns {String} returns.data.soil - 土壤要求
   * @returns {String} returns.data.temperature - 温度范围
   * @returns {String} returns.data.coverImage - 封面图 URL
   * @returns {String} returns.data.description - 描述
   * @returns {Array} returns.data.tips - 养护技巧数组
   * @example
   * const res = await flowerService.getDetail('flower-id-123')
   */
  getDetail(id) {
    return callFunction('flower', { action: 'detail', id, flowerId: id })
  },

  /**
   * 搜索花卉（按名称或别名匹配）
   * @param {String} keyword - 搜索关键词
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Array} returns.data - 匹配的花卉列表，空关键词返回空数组
   * @example
   * const res = await flowerService.search('月季')
   */
  search(keyword) {
    return callFunction('flower', { action: 'search', keyword })
  },

  /**
   * 获取推荐花卉（随机 6 条）
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Array} returns.data - 推荐花卉列表
   * @example
   * const res = await flowerService.getRecommend()
   */
  getRecommend() {
    return callFunction('flower', { action: 'recommend' })
  },
}

module.exports = flowerService
