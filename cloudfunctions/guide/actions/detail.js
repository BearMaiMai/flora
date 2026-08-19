/**
 * 获取种植指南文章详情（阅读量+1）
 */
module.exports = async (event, context, { db }) => {
  const { id } = event
  console.log('[guide/detail] 收到请求:', { id })

  if (!id) {
    return { code: -1, message: '缺少文章ID' }
  }

  try {
    // 尝试 1：doc() 查询
    const docRes = await db.collection('care_guides').doc(id).get()
    console.log('[guide/detail] doc 查询结果:', { dataCount: docRes && docRes.data && docRes.data.length })

    if (docRes && Array.isArray(docRes.data) && docRes.data.length > 0) {
      // 异步自增阅读量
      db.collection('care_guides').doc(id).update({
        data: { viewCount: db.command.inc(1) },
      }).catch(err => console.error('[guide/detail] 阅读量自增失败:', err))

      return { code: 0, data: docRes.data[0] }
    }

    // 尝试 2：where _id 查询（兜底，某些情况下 doc() 拿不到）
    console.log('[guide/detail] doc() 未找到，尝试 where 查询')
    const whereRes = await db.collection('care_guides').where({ _id: id }).get()
    console.log('[guide/detail] where 查询结果:', { dataCount: whereRes && whereRes.data && whereRes.data.length })

    if (whereRes && Array.isArray(whereRes.data) && whereRes.data.length > 0) {
      db.collection('care_guides').doc(id).update({
        data: { viewCount: db.command.inc(1) },
      }).catch(err => console.error('[guide/detail] 阅读量自增失败:', err))

      return { code: 0, data: whereRes.data[0] }
    }

    // 列表里所有文章 ID（用于诊断）
    const allRes = await db.collection('care_guides').limit(5).get()
    console.log('[guide/detail] 库里前 5 篇:', (allRes.data || []).map(d => ({ _id: d._id, title: d.title })))

    return { code: -1, message: '文章未找到', data: { requestedId: id } }
  } catch (err) {
    console.error('[guide/detail] 异常:', err)
    return { code: -1, message: '查询异常: ' + (err.message || 'unknown') }
  }
}