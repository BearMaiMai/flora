const errorCodes = require('../../utils/error-codes')

module.exports = async (event, context, { db }) => {
  const { id, ...updateData } = event
  delete updateData.action
  if (!id) return errorCodes.MISSING_PARAM
  await db.collection('plants').doc(id).update({ data: { ...updateData, updatedAt: db.serverDate() } })
  return { code: 0, message: '更新成功' }
}
