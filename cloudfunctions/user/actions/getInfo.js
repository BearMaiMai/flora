const errorCodes = require('../../utils/error-codes')

/**
 * 获取当前用户信息
 * @returns {String} data._id - 用户记录ID | String | - | user-abc123
 * @returns {String} data.nickName - 昵称 | String | - | 花卉达人
 * @returns {String} data.avatarUrl - 头像URL | String | - | -
 * @returns {Object} data.stats - 统计数据 | Object | - | {plantCount:3,diaryCount:5,reminderCount:5}
 * @returns {Array} data.favoriteFlowerIds - 收藏花卉ID列表 | Array<String> | - | ["flower_001"]
 * @returns {String} data.createdAt - 创建时间 | String | - | 2026-04-01T08:00:00.000Z
 * @returns {String} data.updatedAt - 更新时间 | String | - | 2026-04-30T10:00:00.000Z
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

  // 去掉 _openid，不返回给前端
  const { _openid, ...userData } = data[0]
  return { code: 0, data: userData }
}
