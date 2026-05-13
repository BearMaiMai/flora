/**
 * services/common.js - 公共数据接口
 */
const { callFunction } = require('../utils/cloud')

const commonService = {
  /**
   * 获取首页聚合数据（每日贴士 + 推荐花卉）
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Object} returns.data - 首页数据
   * @returns {String} returns.data.dailyTip - 每日养护贴士
   * @returns {Array} returns.data.recommendList - 推荐花卉列表
   * @example
   * const res = await commonService.getHomeData()
   */
  getHomeData() {
    return callFunction('common', { action: 'getHomeData' })
  },

  /**
   * 获取每日养花小贴士
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Object} returns.data - 贴士数据
   * @returns {String} returns.data.content - 贴士内容
   * @example
   * const res = await commonService.getDailyTip()
   */
  getDailyTip() {
    return callFunction('common', { action: 'getDailyTip' })
  },
}

module.exports = commonService
