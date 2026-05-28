const errorCodes = require('../utils/error-codes')

/**
 * 添加植物生长日记
 * @param {String} plantId - 植物ID | - | String | plant-abc123 | 必填
 * @param {String} content - 日记内容 | - | String | 今天给绿萝浇了水 | 必填
 * @param {Array} [images] - 图片列表 | - | Array<String> | [] | 可选，默认[]
 * @param {Array} [careActions] - 养护操作 | - | Array<String> | ["浇水","施肥"] | 可选
 * @param {String} [weather] - 天气 | - | String | 晴 | 可选
 * @returns {String} data._id - 新日记ID | String | - | diary-abc123 | 成功时返回
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'diary',
 *   data: { action: 'add', plantId: 'plant-abc123', content: '今天给绿萝浇了水', images: [], careActions: ["浇水"], weather: "晴" }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { plantId, content, images = [], careActions = [], weather = '' } = event

  if (!plantId || !content) return errorCodes.MISSING_PARAM

  const res = await db.collection('diaries').add({
    data: {
      _openid: openid,
      plantId,
      content,
      images,
      careActions,
      weather,
      createdAt: db.serverDate(),
    },
  })

  return { code: 0, data: { _id: res._id } }
}
