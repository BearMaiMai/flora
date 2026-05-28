const errorCodes = require('../utils/error-codes')

// 根据分类给默认浇水/施肥间隔（天）
const DEFAULT_INTERVAL = {
  // 观叶植物：一般7天浇一次水
  1: { water: 7, fertilize: 30 },
  // 观花植物：开花期需水多，5天一次
  2: { water: 5, fertilize: 20 },
  // 多肉植物：耐旱，14天一次
  3: { water: 14, fertilize: 60 },
  // 果蔬植物：需水多，3天一次
  4: { water: 3, fertilize: 15 },
  // 驱蚊植物：一般5天一次
  5: { water: 5, fertilize: 30 },
}

/**
 * 添加我的植物（添加到花园）
 * @param {String} flowerId - 花卉ID | flowerId | String | flower_001 | 必填，对应 flowers 集合的 _id
 * @param {String} flowerName - 花卉名称 | flowerName | String | 绿萝 | 必填
 * @param {String} [nickname] - 昵称 | nickname | String | 小绿 | 可选，默认同 flowerName
 * @param {String} [location] - 放置位置 | location | String | 客厅 | 可选
 * @param {String} [imageUrl] - 封面图 | imageUrl | String | https://... | 可选，不传则使用 flowers 集合中的 coverImage
 * @param {Number} [waterInterval] - 浇水间隔天数（天） | waterInterval | Number | 7 | 可选，不传则使用 flowers 集合中该植物的 waterInterval 字段，无则按分类给默认值
 * @param {Number} [fertilizeInterval] - 施肥间隔天数（天） | fertilizeInterval | Number | 30 | 可选，不传则使用 flowers 集合中该植物的 fertilizeInterval 字段，无则按分类给默认值
 * @returns {String} data._id - 新植物记录ID | _id | String | plant-abc123
 * @returns {Number} data.waterInterval - 实际使用的浇水间隔（天） | waterInterval | Number | 7
 * @returns {Number} data.fertilizeInterval - 实际使用的施肥间隔（天） | fertilizeInterval | Number | 30
 * @example
 * // 前端调用示例
 * const res = await wx.cloud.callFunction({
 *   name: 'plant',
 *   data: { action: 'add', flowerId: 'flower_051', flowerName: '发财树' }
 * })
 * // 返回 { code: 0, data: { _id: 'plant_xxx', waterInterval: 14, fertilizeInterval: 30 } }
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { flowerId, flowerName, nickname, location, imageUrl, waterInterval, fertilizeInterval } = event

  if (!flowerId || !flowerName) return errorCodes.MISSING_PARAM

  // 查询花卉信息，获取该植物的浇水/施肥间隔（优先使用）
  // 字段优先级：前端传参 > flowers 集合字段 > 分类默认值 > 硬编码兜底值
  let flowerWaterInterval = null
  let flowerFertilizeInterval = null
  let category = null
  try {
    const { data: flowerData } = await db.collection('flowers').doc(flowerId).get()
    if (flowerData) {
      category = flowerData.category || null
      if (flowerData.waterInterval) flowerWaterInterval = flowerData.waterInterval
      if (flowerData.fertilizeInterval) flowerFertilizeInterval = flowerData.fertilizeInterval
    }
  } catch (e) {
    console.log('[plant/add] 读取 flowers 字段失败，将使用默认值', e.message)
  }

  // 计算实际间隔
  const finalWaterInterval =
    waterInterval || flowerWaterInterval || (DEFAULT_INTERVAL[category] && DEFAULT_INTERVAL[category].water) || 7
  const finalFertilizeInterval =
    fertilizeInterval || flowerFertilizeInterval || (DEFAULT_INTERVAL[category] && DEFAULT_INTERVAL[category].fertilize) || 30

  const now = new Date()
  const res = await db.collection('plants').add({
    data: {
      _openid: openid,
      flowerId,
      flowerName,
      nickname: nickname || flowerName,
      location: location || '',
      imageUrl: imageUrl || '',
      waterInterval: finalWaterInterval,
      fertilizeInterval: finalFertilizeInterval,
      lastWateredAt: now,
      lastFertilizedAt: now,
      status: 'healthy',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate(),
    },
  })

  // 自动创建浇水提醒
  await db.collection('reminders').add({
    data: {
      _openid: openid,
      plantId: res._id,
      type: 'water',
      title: `给${nickname || flowerName}浇水`,
      intervalDays: finalWaterInterval,
      nextRemindAt: new Date(now.getTime() + finalWaterInterval * 24 * 60 * 60 * 1000),
      isCompleted: false,
      isPushed: false,
      createdAt: db.serverDate(),
    },
  })

  // 自动创建施肥提醒
  await db.collection('reminders').add({
    data: {
      _openid: openid,
      plantId: res._id,
      type: 'fertilize',
      title: `给${nickname || flowerName}施肥`,
      intervalDays: finalFertilizeInterval,
      nextRemindAt: new Date(now.getTime() + finalFertilizeInterval * 24 * 60 * 60 * 1000),
      isCompleted: false,
      isPushed: false,
      createdAt: db.serverDate(),
    },
  })

  return {
    code: 0,
    data: {
      _id: res._id,
      waterInterval: finalWaterInterval,
      fertilizeInterval: finalFertilizeInterval,
    },
  }
}
