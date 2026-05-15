/**
 * services/user.js - 用户相关接口
 */
const { callFunction } = require('../utils/cloud')

const userService = {
  /**
   * 用户登录/注册（自动创建用户记录）
   * @param {Object} [userInfo] - 用户信息 | - | - | 示例：- | 可选
   * @param {String} [userInfo.nickName] - 昵称 | - | - | 示例："花友" | 可选
   * @param {String} [userInfo.avatarUrl] - 头像 URL | - | - | 示例："https://..." | 可选
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："登录成功"
   * @returns {Object} returns.data - 用户信息 | 示例：-
   * @returns {String} returns.data._id - 用户 ID | 示例："user-abc123"
   * @returns {String} returns.data._openid - 微信 OpenID | 示例："oLZ5Y123..."
   * @returns {String} returns.data.nickName - 昵称 | 示例："花友"
   * @returns {String} returns.data.avatarUrl - 头像 URL | 示例："https://..."
   * @returns {Array} returns.data.favorites - 收藏的花卉 ID 数组 | 示例：["1","2"]
   * @returns {String} returns.data.createdAt - 创建时间 | 示例："2026-05-15 14:00"
   * @returns {String} returns.data.lastLoginAt - 最后登录时间 | 示例："2026-05-15 14:00"
   */
  login(userInfo) {
    return callFunction('user', { action: 'login', userInfo })
  },

  /**
   * 更新用户昵称和头像
   * @param {Object} data - 用户信息 | - | - | 示例：- | 传入即更新
   * @param {String} [data.nickName] - 昵称 | - | - | 示例："新昵称" | 可选
   * @param {String} [data.avatarUrl] - 头像 URL | - | - | 示例："https://..." | 可选
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："更新成功"
   */
  updateInfo(data) {
    return callFunction('user', { action: 'updateInfo', ...data })
  },

  /**
   * 切换收藏状态（已收藏则取消，未收藏则添加）
   * @param {String} flowerId - 花卉 ID | - | - | 示例："1" | 必填
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："收藏成功"
   * @returns {Object} returns.data - 收藏状态 | 示例：-
   * @returns {Boolean} returns.data.isFavorite - 当前是否已收藏 | 示例：true
   */
  toggleFavorite(flowerId) {
    return callFunction('user', { action: 'toggleFavorite', flowerId })
  },

  /**
   * 获取我的收藏列表（返回完整花卉对象）
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："success"
   * @returns {Object} returns.data - 收藏数据 | 示例：-
   * @returns {Array} returns.data.list - 收藏的花卉列表 | 示例：-
   * @returns {Number} returns.data.total - 收藏总数 | 示例：5
   */
  getFavorites() {
    return callFunction('user', { action: 'getFavorites' })
  },

  /**
   * 获取用户统计（植物数、日记数、收藏数）
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："success"
   * @returns {Object} returns.data - 统计数据 | 示例：-
   * @returns {Number} returns.data.plantCount - 植物数量 | 示例：3
   * @returns {Number} returns.data.diaryCount - 日记数量 | 示例：10
   * @returns {Number} returns.data.favoriteCount - 收藏数量 | 示例：5
   */
  getStats() {
    return callFunction('user', { action: 'getStats' })
  },
}

module.exports = userService
