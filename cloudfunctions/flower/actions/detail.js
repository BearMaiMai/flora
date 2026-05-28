const errorCodes = require('../utils/error-codes')

/**
 * 获取花卉详情
 * @param {String} id - 花卉ID | - | String | flower_001 | 必填
 * @returns {String} data._id - 花卉ID | String | - | flower_001
 * @returns {String} data.name - 花卉名称 | String | - | 绿萝
 * @returns {String} data.scientificName - 学名 | String | - | Epipremnum aureum
 * @returns {Array} data.alias - 别名列表 | Array<String> | - | ["魔鬼藤","黄金葛"]
 * @returns {String} data.family - 科属 | String | - | 天南星科
 * @returns {String} data.coverImage - 封面图 | String | - | cloud://...
 * @returns {String} data.category - 分类 | String | - | 观叶植物,观花植物,多肉植物,果蔬植物,驱蚊植物
 * @returns {String} data.plantType - 植物类型 | String | - | 藤本
 * @returns {Number} data.difficulty - 养护难度 | Number | - | 1~5
 * @returns {String} data.light - 光照需求 | String | - | 耐阴，散射光
 * @returns {String} data.temperature - 适宜温度 | String | - | 15-30°C
 * @returns {String} data.waterDays - 浇水需求 | String | - | 见干见湿
 * @returns {String} data.fertilizeDays - 施肥需求 | String | - | 生长期每半月施肥一次
 * @returns {String} data.soil - 土壤要求 | String | - | 疏松、肥沃的土壤
 * @returns {String} data.propagation - 繁殖方法 | String | - | 既可以水培也可以土培，繁殖多采用扦插的方法
 * @returns {String} data.pruning - 修剪建议 | String | - | 注意要及时修剪，枝条过密会影响通风
 * @returns {String} data.repotting - 换盆建议 | String | - | 春季换盆，选用透气土壤
 * @returns {String} data.pestControl - 病虫害防治 | String | - | 注意预防蚜虫和红蜘蛛
 * @returns {String} data.floweringSeason - 花期 | String | - | 春夏季
 * @returns {String} data.weeding - 除草建议 | String | - | 及时清除杂草
 * @returns {String} data.sowing - 播种方法 | String | - | 春季播种，保持土壤湿润
 * @returns {Array} data.season - 适宜季节 | Array<String> | - | ["春","夏","秋"]
 * @returns {Boolean} data.isIndoor - 是否室内 | Boolean | - | true
 * @returns {String} data.description - 描述 | String | - | 绿萝属于麒麟叶属植物...
 * @returns {String} data.flowerLanguage - 花语 | String | - | 守望幸福
 * @returns {Array} data.tags - 标签 | Array<String> | - | ["室内","耐阴","净化空气"]
 * @returns {Array} data.expertAnswer - 专家解答 | Array<Object> | - | [{question, answer}]
 * @returns {String} data.expertAnswer[].question - 问题标题 | String | - | 文竹盆景怎么养护，黄叶怎么办
 * @returns {String} data.expertAnswer[].answer - 回答内容 | String | - | 养文竹盆景的时候要放在温暖处...
 * @returns {Boolean} data.isPublished - 是否发布 | Boolean | - | true
 * @returns {Number} data.sortOrder - 排序权重 | Number | - | 1
 * @returns {Boolean} data.isFavorite - 是否已收藏 | Boolean | - | false | 未登录时返回 false
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'flower',
 *   data: { action: 'detail', id: 'flower_001' }
 * })
 */
const CATEGORY_MAP = {
  1: '观叶植物',
  2: '观花植物',
  3: '多肉植物',
  4: '果蔬植物',
  5: '驱蚊植物',
}

module.exports = async (event, context, { db }) => {
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM

  const { data } = await db.collection('flowers').doc(id).get()
  if (!data) return errorCodes.NOT_FOUND

  // 将 category 数字转为中文，保持与 list 接口一致
  if (data.category != null) {
    data.category = CATEGORY_MAP[data.category] || data.category
  }

  // 查询是否收藏（未登录时 openid 为空，直接返回 false）
  let isFavorite = false
  const openid = context.OPENID || context.FROM_OPENID || ''
  if (openid) {
    const { data: users } = await db.collection('users').where({ _openid: openid }).limit(1).get()
    if (users && users.length > 0 && Array.isArray(users[0].favorites)) {
      isFavorite = users[0].favorites.includes(id)
    }
  }
  data.isFavorite = isFavorite

  return { code: 0, data }
}
