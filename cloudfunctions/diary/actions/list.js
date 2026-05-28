/**
 * 获取日记列表（可按植物筛选）
 * @param {String} [plantId] - 植物ID筛选 | - | String | plant-abc123 | 可选，不传则返回全部
 * @returns {Array} data - 日记对象数组 | Array<Object> | - | 含各字段
 * @returns {String} data[]._id - 日记ID | String | - | diary-abc123
 * @returns {String} data[].plantId - 植物ID | String | - | plant-abc123
 * @returns {String} data[].content - 日记内容 | String | - | 今天给绿萝浇了水
 * @returns {Array} data[].images - 图片列表 | Array<String> | - | ["cloud://..."]
 * @returns {Array} data[].careActions - 养护操作 | Array<String> | - | ["浇水","施肥"]
 * @returns {String} data[].weather - 天气 | String | - | 晴
 * @returns {Object} data[].createdAt - 创建时间 | Object | - | 服务端时间对象
 * @returns {Object} data[].updatedAt - 更新时间 | Object | - | 服务端时间对象
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'diary',
 *   data: { action: 'list', plantId: 'plant-abc123' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { plantId } = event

  let query = db.collection('diaries').where({ _openid: openid })
  if (plantId) query = query.where({ plantId })

  const { data } = await query.orderBy('createdAt', 'desc').limit(50).get()
  return { code: 0, data }
}
