const errorCodes = require('../../utils/error-codes')

module.exports = async (event, context, { db }) => {
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM
  await db.collection('reminders').doc(id).update({
    data: { status: 'completed', completedAt: db.serverDate() },
  })
  return { code: 0, message: '已完成' }
}
