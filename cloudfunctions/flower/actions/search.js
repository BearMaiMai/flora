// cloudfunctions/flower/actions/search.js
module.exports = async (event, context, { db }) => {
  const { keyword = '' } = event
  if (!keyword.trim()) return { code: 0, data: [] }

  const { data } = await db.collection('flowers')
    .where(db.command.or([
      { name: db.RegExp({ regexp: keyword, options: 'i' }) },
      { alias: db.RegExp({ regexp: keyword, options: 'i' }) },
    ]))
    .limit(20)
    .get()

  return { code: 0, data }
}
