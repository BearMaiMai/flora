const errorCodes = require('../../utils/error-codes')

module.exports = async (event, context, { db }) => {
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM
  await db.collection('diaries').doc(id).remove()
  return { code: 0, message: '删除成功' }
}
