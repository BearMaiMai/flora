/**
 * services/flower.js - 花卉相关接口
 */
const { callFunction } = require('../utils/cloud')

const flowerService = {
  /**
   * 获取花卉列表（支持分页和分类筛选）
   * @param {Object} params - 查询参数 | - | - | - | 传入即按条件筛选
   * @param {Number} [params.page=1] - 页码，默认 1 | 取值范围：1-10000 | 格式：正整数 | 示例：1 | 备注：与 pageSize 配合做分页
   * @param {Number} [params.pageSize=20] - 每页数量，默认 20 | 取值范围：1-100 | 格式：正整数 | 示例：20 | 备注：最大100
   * @param {Number} [params.category] - 分类筛选（1=观叶 2=观花 3=多肉 4=果蔬） | 取值范围：1-4 | 格式：枚举整数 | 示例：2 | 备注：不传则返回全部分类
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："success"
   * @returns {Object} returns.data - 花卉列表数据 | 示例：-
   * @returns {Array} returns.data.list - 花卉列表 | 示例：-
   * @returns {Number} returns.data.total - 总数 | 示例：120
   * @returns {String} returns.data.list[]._id - 花卉 ID | 示例："1"
   * @returns {String} returns.data.list[].name - 花卉名称 | 示例："月季"
   * @returns {Array} returns.data.list[].alias - 别名数组 | 示例：["玫瑰","刺玫"]
   * @returns {Number} returns.data.list[].category - 分类（1=观叶 2=观花 3=多肉 4=果蔬） | 示例：2
   * @returns {Number} returns.data.list[].difficulty - 养护难度（1-5） | 示例：3
   * @returns {String} returns.data.list[].coverImage - 封面图 URL | 示例：""
   * @returns {String} returns.data.list[].description - 描述 | 示例："喜阴耐旱"
   * @example
   * const res = await flowerService.getList({ page: 1, pageSize: 20 })
   * const res = await flowerService.getList({ category: 2 })
   */
  getList(params = {}) {
    // 确保 category 是数字类型
    if (params.category !== undefined) {
      params.category = Number(params.category)
    }
    return callFunction('flower', { action: 'list', ...params })
  },

  /**
   * 获取花卉详情
   * @param {String} id - 花卉 ID | - | - | 示例："1" | 必填
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："success"
   * @returns {Object} returns.data - 花卉详情 | 示例：-
   * @returns {String} returns.data._id - 花卉 ID | 示例："1"
   * @returns {String} returns.data.name - 花卉名称 | 示例："月季"
   * @returns {Array} returns.data.alias - 别名数组 | 示例：["玫瑰"]
   * @returns {Number} returns.data.category - 分类（1=观叶 2=观花 3=多肉 4=果蔬） | 示例：2
   * @returns {Number} returns.data.difficulty - 养护难度（1-5） | 示例：3
   * @returns {Number} returns.data.waterDays - 浇水间隔天数 | 示例：7
   * @returns {Number} returns.data.fertilizeDays - 施肥间隔天数 | 示例：30
   * @returns {String} returns.data.light - 光照需求 | 示例："半阴"
   * @returns {String} returns.data.soil - 土壤要求 | 示例："疏松透气"
   * @returns {String} returns.data.temperature - 温度范围 | 示例："15-25℃"
   * @returns {String} returns.data.coverImage - 封面图 URL | 示例：""
   * @returns {String} returns.data.description - 描述 | 示例："喜阴耐旱"
   * @returns {Array} returns.data.tips - 养护技巧数组 | 示例：["定期浇水","避免暴晒"]
   * @example
   * const res = await flowerService.getDetail('1')
   */
  getDetail(id) {
    return callFunction('flower', { action: 'detail', id, flowerId: id })
  },

  /**
   * 搜索花卉（按名称或别名匹配）
   * @param {String} keyword - 搜索关键词 | - | - | 示例："月季" | 备注：为空则返回空数组
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："success"
   * @returns {Object} returns.data - 搜索结果 | 示例：-
   * @returns {Array} returns.data.list - 匹配的花卉列表 | 示例：-
   * @returns {Number} returns.data.total - 总数 | 示例：5
   * @example
   * const res = await flowerService.search('月季')
   */
  search(keyword) {
    return callFunction('flower', { action: 'search', keyword })
  },

  /**
   * 获取推荐花卉（随机 6 条）
   * @returns {Object} 返回结果 | 示例：-
   * @returns {Number} returns.code - 状态码（0=成功） | 示例：0
   * @returns {String} returns.message - 提示信息 | 示例："success"
   * @returns {Object} returns.data - 推荐数据 | 示例：-
   * @returns {Array} returns.data.list - 推荐花卉列表 | 示例：-
   * @returns {Number} returns.data.total - 总数 | 示例：6
   * @example
   * const res = await flowerService.getRecommend()
   */
  getRecommend() {
    return callFunction('flower', { action: 'recommend' })
  },
}

module.exports = flowerService
