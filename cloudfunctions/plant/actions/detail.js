const errorCodes = require('../utils/error-codes')

/**
 * 获取我的单棵植物详情
 * @param {String} id - 植物ID | - | String | plant-abc123 | 必填
 * @returns {String} data._id - 植物ID | String | - | plant-abc123
 * @returns {String} data.flowerId - 花卉ID | String | - | flower_001
 * @returns {String} data.flowerName - 花卉名称 | String | - | 绿萝
 * @returns {String} data.nickname - 昵称 | String | - | 小绿
 * @returns {String} data.status - 状态 | String | - | healthy
 * @returns {String} data.location - 放置位置 | String | - | 客厅窗台
 * @returns {String} data.imageUrl - 植物图片URL | String | - | cloud://xxx
 * @returns {Object} data.createdAt - 创建时间 | Object | - | 服务端时间对象
 * @returns {Object} data.updatedAt - 更新时间 | Object | - | 服务端时间对象
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'plant',
 *   data: { action: 'detail', id: 'plant-abc123' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM

  const { data } = await db.collection('plants').doc(id).get()
  if (!data || data._openid !== openid) return errorCodes.DATA_NOT_FOUND
  return { code: 0, data }
}
