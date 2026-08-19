const errorCodes = require('../utils/error-codes')

/**
 * 获取当前用户信息
 * @returns {Array} data.favorites - 收藏花卉ID列表 | Array<String> | - | ["flower_001"]
 * @returns {String} data.nickName - 昵称 | String | - | 花卉达人
 * @returns {String} data.avatarUrl - 头像URL | String | - | -
 * @returns {Object} data.createdAt - 创建时间 | Object | - | 服务端时间
 * @returns {Object} data.lastLoginAt - 最后登录时间 | Object | - | 服务端时间
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'user',
 *   data: { action: 'getInfo' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { data } = await db.collection('users').where({ _openid: openid }).get()
  if (!data.length) return errorCodes.USER_NOT_FOUND

  const u = data[0]
  return {
    code: 0,
    data: {
      _id: u._id,
      nickName: u.nickName || '花友',
      avatarUrl: u.avatarUrl || '',
      favorites: u.favorites || [],
    }
  }
}
