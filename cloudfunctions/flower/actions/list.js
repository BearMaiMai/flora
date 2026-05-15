// cloudfunctions/flower/actions/list.js
module.exports = async (event, context, { db }) => {
  const { page = 1, pageSize = 20, category } = event
  const skip = (page - 1) * pageSize

  let query = db.collection('flowers')
  if (category !== undefined && category !== '') {
    query = query.where({ category: Number(category) })
  }

  const { data } = await query
    .skip(skip)
    .limit(pageSize)
    .orderBy('name', 'asc')
    .get()

  return { code: 0, data }
}
