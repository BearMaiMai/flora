/**
 * services/user.js - 用户相关接口
 */
const { callFunction } = require('../utils/cloud')

const userService = {
  /** 用户登录 */
  login(userInfo) {
    return callFunction('user', { action: 'login', userInfo })
  },

  /** 更新用户信息 */
  updateInfo(data) {
    return callFunction('user', { action: 'updateInfo', ...data })
  },

  /** 切换收藏 */
  toggleFavorite(flowerId) {
    return callFunction('user', { action: 'toggleFavorite', flowerId })
  },

  /** 获取收藏列表 */
  getFavorites() {
    return callFunction('user', { action: 'getFavorites' })
  },

  /** 获取用户统计 */
  getStats() {
    return callFunction('user', { action: 'getStats' })
  },
}

module.exports = userService
