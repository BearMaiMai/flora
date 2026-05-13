const errorCodes = require('../../utils/error-codes')

module.exports = async (event, context, { db }) => {
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM

  const { data } = await db.collection('flowers').doc(id).get()
  return { code: 0, data }
}
