/**
 * constants/icons.js - 图标映射表
 * 统一管理所有 Emoji 图标，各页面通过 name 引用
 * 未来如需切换为字体图标，仅需修改此文件 + icon 组件
 */

/** 养护动作图标 */
const CARE_ICONS = {
  water: '💧',
  sun: '☀️',
  soil: '🪴',
  temp: '🌡️',
  fertilizer: '🧪',
  humidity: '💨',
  prune: '✂️',
  repot: '🪴',
}

/** 导航 / 操作图标 */
const ACTION_ICONS = {
  search: '🔍',
  add: '+',
  edit: '✏️',
  back: '‹',
  arrow: '›',
  close: '×',
  check: '✓',
  more: '···',
}

/** 内容 / 装饰图标 */
const CONTENT_ICONS = {
  plant: '🌱',
  leaf: '🌿',
  flower: '🌸',
  tree: '🪴',
  clipboard: '📋',
  book: '📖',
  bell: '🔔',
  heart: '❤️',
  heartEmpty: '🤍',
  gear: '⚙️',
  info: 'ℹ️',
  mail: '📭',
}

/** 状态图标 */
const STATUS_ICONS = {
  success: '✅',
  warning: '⚠️',
  error: '❌',
  loading: '⏳',
  empty: '📭',
}

/** 天气 / 环境图标 */
const WEATHER_ICONS = {
  sunny: '☀️',
  cloudy: '⛅',
  rainy: '🌧️',
  wind: '💨',
  snow: '❄️',
}

/** 季节图标 */
const SEASON_ICONS = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
}

/**
 * 完整图标集合 — 供 <icon> 组件使用
 * 通过 ICONS[name] 获取对应 Emoji
 */
const ICONS = {
  ...CARE_ICONS,
  ...ACTION_ICONS,
  ...CONTENT_ICONS,
  ...STATUS_ICONS,
  ...WEATHER_ICONS,
  // 季节单独命名避免覆盖
  seasonSpring: SEASON_ICONS.spring,
  seasonSummer: SEASON_ICONS.summer,
  seasonAutumn: SEASON_ICONS.autumn,
  seasonWinter: SEASON_ICONS.winter,
}

module.exports = {
  ICONS,
  CARE_ICONS,
  ACTION_ICONS,
  CONTENT_ICONS,
  STATUS_ICONS,
  WEATHER_ICONS,
  SEASON_ICONS,
}
