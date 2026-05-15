/**
 * services/common.js - 公共数据接口
 */
const { callFunction } = require('../utils/cloud')

const commonService = {
  /**
   * 获取首页聚合数据（每日贴士 + 推荐花卉）
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："success"
   * @returns {Object} returns.data - 首页数据 | 示例：-
   * @returns {String} returns.data.dailyTip - 每日养护贴士 | 示例："今天是立夏，气温升高..."
   * @returns {Array} returns.data.recommendList - 推荐花卉列表 | 示例：-
   * @returns {Number} returns.data.recommendTotal - 推荐总数 | 示例：6
   */
  getHomeData() {
    return callFunction('common', { action: 'getHomeData' })
  },

  /**
   * 获取每日养花小贴士
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："success"
   * @returns {Object} returns.data - 贴士数据 | 示例：-
   * @returns {String} returns.data.content - 贴士内容 | 示例："今天是立夏，气温升高..."
   */
  getDailyTip() {
    return callFunction('common', { action: 'getDailyTip' })
  },
}

module.exports = commonService
