/**
 * services/guide.js - 种植指南文章接口
 */
const { callFunction } = require('../utils/cloud')

module.exports = {
  getList(params) { return callFunction('guide', { action: 'list', ...params }) },
  getFeatured() { return callFunction('guide', { action: 'featured' }) },
  getDetail(id) { return callFunction('guide', { action: 'detail', id }) },
}
