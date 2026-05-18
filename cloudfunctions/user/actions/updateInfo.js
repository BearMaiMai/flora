/**
 * 更新用户信息（昵称、头像）
 * @param {String} [nickName] - 昵称 | - | String | 新昵称 | 可选
 * @param {String} [avatarUrl] - 头像URL | - | URL | - | 可选
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'user',
 *   data: { action: 'updateInfo', nickName: '新昵称', avatarUrl: 'https://...' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { nickName, avatarUrl } = event
  await db.collection('users').where({ _openid: openid }).update({ data: { nickName, avatarUrl } })
  return { code: 0, message: '更新成功' }
}