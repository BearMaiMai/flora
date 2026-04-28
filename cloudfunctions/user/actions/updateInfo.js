// cloudfunctions/user/actions/updateInfo.js
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { nickName, avatarUrl } = event
  await db.collection('users').where({ _openid: openid }).update({ data: { nickName, avatarUrl } })
  return { code: 0, message: '更新成功' }
}
