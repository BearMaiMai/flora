/**
 * services/common.js - 公共数据接口
 */
const { callFunction } = require('../utils/cloud')

const commonService = {
  /** 获取首页聚合数据（推荐花卉 + 每日贴士） */
  getHomeData() {
    return callFunction('common', { action: 'getHomeData' })
  },

  /** 获取每日养花小贴士 */
  getDailyTip() {
    return callFunction('common', { action: 'getDailyTip' })
  },
}

module.exports = commonService
