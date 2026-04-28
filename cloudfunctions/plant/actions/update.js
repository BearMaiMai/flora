// cloudfunctions/plant/actions/update.js
module.exports = async (event, context, { db }) => {
  const { id, ...updateData } = event
  delete updateData.action
  if (!id) return { code: -1, message: '缺少植物 ID' }
  await db.collection('plants').doc(id).update({ data: { ...updateData, updatedAt: db.serverDate() } })
  return { code: 0, message: '更新成功' }
}
