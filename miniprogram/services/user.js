/**
 * services/user.js - 用户相关接口
 */
const { callFunction } = require('../utils/cloud')

const userService = {
  /**
   * 用户登录/注册（自动创建用户记录）
   * @param {Object} [userInfo] - 用户信息
   * @param {String} [userInfo.nickName] - 昵称
   * @param {String} [userInfo.avatarUrl] - 头像 URL
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Object} returns.data - 用户信息
   * @returns {String} returns.data._id - 用户 ID
   * @returns {String} returns.data._openid - 微信 OpenID
   * @returns {String} returns.data.nickName - 昵称
   * @returns {String} returns.data.avatarUrl - 头像 URL
   * @returns {Array} returns.data.favorites - 收藏的花卉 ID 数组
   * @returns {Date} returns.data.createdAt - 创建时间
   * @returns {Date} returns.data.lastLoginAt - 最后登录时间
   * @example
   * const res = await userService.login()
   * const res = await userService.login({ nickName: '花友', avatarUrl: 'https://...' })
   */
  login(userInfo) {
    return callFunction('user', { action: 'login', userInfo })
  },

  /**
   * 更新用户昵称和头像
   * @param {Object} data - 用户信息
   * @param {String} [data.nickName] - 昵称
   * @param {String} [data.avatarUrl] - 头像 URL
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {String} returns.message - 提示信息
   * @example
   * const res = await userService.updateInfo({ nickName: '新昵称' })
   */
  updateInfo(data) {
    return callFunction('user', { action: 'updateInfo', ...data })
  },

  /**
   * 切换收藏状态（已收藏则取消，未收藏则添加）
   * @param {String} flowerId - 花卉 ID
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Object} returns.data - 收藏状态
   * @returns {Boolean} returns.data.isFavorite - 当前是否已收藏
   * @example
   * const res = await userService.toggleFavorite('flower-id-123')
   * console.log(res.data.isFavorite) // true/false
   */
  toggleFavorite(flowerId) {
    return callFunction('user', { action: 'toggleFavorite', flowerId })
  },

  /**
   * 获取我的收藏列表（返回完整花卉对象）
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Object} returns.data - 收藏数据
   * @returns {Array} returns.data.list - 收藏的花卉列表
   * @returns {Number} returns.data.total - 收藏总数
   * @example
   * const res = await userService.getFavorites()
   * console.log(res.data.list)
   * console.log(res.data.total)
   */
  getFavorites() {
    return callFunction('user', { action: 'getFavorites' })
  },

  /**
   * 获取用户统计（植物数、日记数、收藏数）
   * @returns {Object} 返回结果
   * @returns {Number} returns.code - 状态码（0=成功）
   * @returns {Object} returns.data - 统计数据
   * @returns {Number} returns.data.plantCount - 植物数量
   * @returns {Number} returns.data.diaryCount - 日记数量
   * @returns {Number} returns.data.favoriteCount - 收藏数量
   * @example
   * const res = await userService.getStats()
   */
  getStats() {
    return callFunction('user', { action: 'getStats' })
  },
}

module.exports = userService
