/**
 * constants/index.js - 常量定义汇总
 */
const flower = require('./flower')
const reminder = require('./reminder')

module.exports = {
  ...flower,
  ...reminder,
}
