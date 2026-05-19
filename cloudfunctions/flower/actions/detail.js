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
 * @returns {Number} data.category - 分类 | Number | - | 1=观叶,2=观花,3=多肉,4=果蔬
 * @returns {String} data.plantType - 植物类型 | String | - | 藤本
 * @returns {Number} data.difficulty - 养护难度 | Number | - | 1~5
 * @returns {String} data.light - 光照需求 | String | - | 耐阴，散射光
 * @returns {String} data.temperature - 适宜温度 | String | - | 15-30°C
 * @returns {Number} data.waterDays - 浇水间隔天数 | Number | - | 5
 * @returns {Number} data.fertilizeDays - 施肥间隔天数 | Number | - | 20
 * @returns {Array} data.season - 适宜季节 | Array<String> | - | ["春","夏","秋"]
 * @returns {Boolean} data.isIndoor - 是否室内 | Boolean | - | true
 * @returns {String} data.description - 描述 | String | - | 绿萝属于麒麟叶属植物...
 * @returns {String} data.flowerLanguage - 花语 | String | - | 守望幸福
 * @returns {Array} data.tags - 标签 | Array<String> | - | ["室内","耐阴","净化空气"]
 * @returns {Boolean} data.isPublished - 是否发布 | Boolean | - | true
 * @returns {Number} data.sortOrder - 排序权重 | Number | - | 1
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'flower',
 *   data: { action: 'detail', id: 'flower_001' }
 * })
 */
module.exports = async (event, context, { db }) => {
  const { id } = event
  if (!id) return errorCodes.MISSING_PARAM

  const { data } = await db.collection('flowers').doc(id).get()
  return { code: 0, data }
}
