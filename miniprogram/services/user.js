/**
 * services/user.js - 用户相关接口
 */
const { callFunction } = require('../utils/cloud')

const userService = {
  /** 用户登录（首次自动注册）
   * @param {Object} [userInfo] - 可选，含 nickName/avatarUrl
   */
  login(userInfo = null) {
    const params = { action: 'login' }
    if (userInfo) params.userInfo = userInfo
    return callFunction('user', params)
  },

  /** 获取当前用户基本信息（含 favoriteIds） */
  getInfo() {
    return callFunction('user', { action: 'getInfo' })
  },

  /** 更新用户信息 */
  updateInfo(data) {
    return callFunction('user', { action: 'updateInfo', ...data })
  },

  /** 切换收藏 */
  toggleFavorite(flowerId) {
    return callFunction('user', { action: 'toggleFavorite', flowerId })
  },

  /** 获取收藏的花卉详情列表 */
  getFavorites() {
    return callFunction('user', { action: 'getFavorites' })
  },

  /** 获取用户统计（植物数/日记数/收藏数） */
  getStats() {
    return callFunction('user', { action: 'getStats' })
  },
}

module.exports = userService
