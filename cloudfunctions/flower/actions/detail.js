// cloudfunctions/flower/actions/detail.js
module.exports = async (event, context, { db }) => {
  const { id } = event
  if (!id) return { code: -1, message: '缺少花卉 ID' }

  const { data } = await db.collection('flowers').doc(id).get()
  return { code: 0, data }
}
