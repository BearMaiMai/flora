// cloudfunctions/reminder/actions/complete.js
module.exports = async (event, context, { db }) => {
  const { id } = event
  if (!id) return { code: -1, message: '缺少提醒 ID' }
  await db.collection('reminders').doc(id).update({
    data: { status: 'completed', completedAt: db.serverDate() },
  })
  return { code: 0, message: '已完成' }
}
