// cloudfunctions/plant/actions/remove.js
module.exports = async (event, context, { db }) => {
  const { id } = event
  if (!id) return { code: -1, message: '缺少植物 ID' }
  await db.collection('plants').doc(id).remove()
  return { code: 0, message: '删除成功' }
}
