const errorCodes = require('../utils/error-codes')

/**
 * 添加我的植物
 * @param {String} flowerId - 花卉ID | - | String | flower_001 | 必填
 * @param {String} flowerName - 花卉名称 | - | String | 绿萝 | 必填
 * @param {String} [nickname] - 昵称 | - | String | 小绿 | 可选，默认同 flowerName
 * @param {String} [location] - 放置位置 | - | String | 客厅 | 可选
 * @param {String} [imageUrl] - 封面图 | - | URL | - | 可选
 * @returns {String} data._id - 新植物ID | String | - | plant-abc123
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'plant',
 *   data: { action: 'add', flowerId: 'flower_001', flowerName: '绿萝', nickname: '小绿', location: '客厅' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { flowerId, flowerName, nickname, location, imageUrl } = event

  if (!flowerId) return errorCodes.MISSING_PARAM

  const res = await db.collection('plants').add({
    data: {
      _openid: openid,
      flowerId,
      flowerName,
      nickname: nickname || flowerName,
      location: location || '',
      imageUrl: imageUrl || '',
      status: 'healthy',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate(),
    },
  })

  return { code: 0, data: { _id: res._id } }
}
