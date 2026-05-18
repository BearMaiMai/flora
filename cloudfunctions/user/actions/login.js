/**
 * 用户登录/注册（自动获取微信openid）
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'user',
 *   data: { action: 'login', userInfo: { nickName: '花友', avatarUrl: 'https://...' } }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const { data } = await db.collection('users').where({ _openid: openid }).get()

  if (data.length > 0) {
    // 已有用户，更新登录时间
    await db.collection('users').doc(data[0]._id).update({ data: { lastLoginAt: db.serverDate() } })
    return { code: 0, data: data[0] }
  }

  // 新用户注册
  const newUser = {
    _openid: openid,
    nickName: event.userInfo?.nickName || '花友',
    avatarUrl: event.userInfo?.avatarUrl || '',
    favorites: [],
    createdAt: db.serverDate(),
    lastLoginAt: db.serverDate(),
  }
  const res = await db.collection('users').add({ data: newUser })
  return { code: 0, data: { _id: res._id, ...newUser } }
}
