// cloudfunctions/plant/actions/list.js
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { data } = await db.collection('plants')
    .where({ _openid: openid })
    .orderBy('createdAt', 'desc')
    .get()
  return { code: 0, data }
}
