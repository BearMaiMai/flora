// cloudfunctions/reminder/actions/list.js
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { data } = await db.collection('reminders')
    .where({ _openid: openid, status: 'pending' })
    .orderBy('remindAt', 'asc')
    .get()
  return { code: 0, data }
}
