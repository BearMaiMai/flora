/**
 * 获取花卉分类列表
 * @returns {Array} data.list - 分类数组 | Array<Object> | - | 固定4个分类
 * @returns {Number} data.list[].id - 分类ID | Number | 1 | 1=观叶,2=观花,3=多肉,4=果蔬
 * @returns {String} data.list[].name - 分类名称 | String | 观叶植物 | 1=观叶植物,2=观花植物,3=多肉植物,4=果蔬
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'flower',
 *   data: { action: 'getCategories' }
 * })
 */
module.exports = async (event, context) => {
  const categories = [
    { id: 1, name: '观叶植物' },
    { id: 2, name: '观花植物' },
    { id: 3, name: '多肉植物' },
    { id: 4, name: '果蔬' },
  ]
  return { code: 0, data: { list: categories } }
}
