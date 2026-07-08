/**
 * 用户退出登录（清除 session，但不删除用户数据）
 * @returns {String} message - 退出成功 | String | - | 退出成功
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'user',
 *   data: { action: 'logout' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { data } = await db.collection('users').where({ _openid: openid }).get()

  if (data.length > 0) {
    await db.collection('users').doc(data[0]._id).update({
      data: { sessionToken: '', loggedOutAt: db.serverDate() }
    })
  }

  return { code: 0, message: '退出成功' }
}
