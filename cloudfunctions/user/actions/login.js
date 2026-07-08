/**
 * 用户登录/注册（自动获取微信open_id）
 * @param {Object} [userInfo] - 用户信息 | - | Object | {nickName:'花友',avatarUrl:'...'} | 可选
 * @param {String} [userInfo.nickName] - 昵称 | - | String | 花友 | 可选，默认'花友'
 * @param {String} [userInfo.avatarUrl] - 头像URL | - | URL | - | 可选
 * @returns {Object} data - 用户对象 | Object | - | 含所有用户字段
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'user',
 *   data: { action: 'login', userInfo: { nickName: '花友', avatarUrl: '' } }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const { data } = await db.collection('users').where({ _openid: openid }).get()

  if (data.length > 0) {
    // 已有用户，更新登录时间 + 生成新 session token
    const sessionToken = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`
    await db.collection('users').doc(data[0]._id).update({
      data: { sessionToken, lastLoginAt: db.serverDate() }
    })
    return { code: 0, data: { ...data[0], sessionToken } }
  }

  // 新用户注册
  const sessionToken = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const newUser = {
    _openid: openid,
    nickName: event.userInfo?.nickName || '花友',
    avatarUrl: event.userInfo?.avatarUrl || '',
    sessionToken,
    favorites: [],
    createdAt: db.serverDate(),
    lastLoginAt: db.serverDate(),
  }
  const res = await db.collection('users').add({ data: newUser })
  return { code: 0, data: { _id: res._id, ...newUser } }
}