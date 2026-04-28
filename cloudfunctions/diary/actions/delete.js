// cloudfunctions/diary/actions/delete.js
module.exports = async (event, context, { db }) => {
  const { id } = event
  if (!id) return { code: -1, message: '缺少日记 ID' }
  await db.collection('diaries').doc(id).remove()
  return { code: 0, message: '删除成功' }
}
