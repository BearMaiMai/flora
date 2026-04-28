/**
 * constants/flower.js - 花卉相关常量
 */

/** 花卉分类 */
const FLOWER_CATEGORIES = [
  '观花植物', '观叶植物', '多肉植物', '水生植物', '草本植物', '木本植物',
]

/** 养护难度 */
const DIFFICULTY_LEVELS = [
  { value: 1, label: '入门级' },
  { value: 2, label: '简单' },
  { value: 3, label: '中等' },
  { value: 4, label: '较难' },
  { value: 5, label: '专家级' },
]

/** 光照需求 */
const LIGHT_REQUIREMENTS = ['强光', '散射光', '半阴', '阴处']

/** 浇水频率 */
const WATERING_FREQUENCY = ['每天', '2-3天', '每周', '10-15天', '按需']

module.exports = {
  FLOWER_CATEGORIES,
  DIFFICULTY_LEVELS,
  LIGHT_REQUIREMENTS,
  WATERING_FREQUENCY,
}
