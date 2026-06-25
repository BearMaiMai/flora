/**
 * constants/flower.js - 花卉相关常量
 * 注意：CATEGORIES 必须与后端 cloudfunctions/flower 中 getCategories 返回的分类保持一致
 */

/** 花卉分类（与后端对齐） */
const FLOWER_CATEGORIES = [
  '观叶植物',
  '观花植物',
  '多肉植物',
  '果蔬植物',
  '驱蚊植物',
]

/** 分类 → 标签颜色（用于 tag-* 样式类） */
const CATEGORY_COLOR_MAP = {
  '观叶植物': 'green',
  '观花植物': 'pink',
  '多肉植物': 'purple',
  '果蔬植物': 'orange',
  '驱蚊植物': 'blue',
}

/** 分类 → 默认 emoji 占位图 */
const CATEGORY_EMOJI_MAP = {
  '观叶植物': '🌿',
  '观花植物': '🌸',
  '多肉植物': '🌵',
  '果蔬植物': '🍅',
  '驱蚊植物': '💜',
}

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
  CATEGORY_COLOR_MAP,
  CATEGORY_EMOJI_MAP,
  DIFFICULTY_LEVELS,
  LIGHT_REQUIREMENTS,
  WATERING_FREQUENCY,
}
