/**
 * constants/icons.js - 图标映射表
 * 统一管理所有图标，各页面通过 name 引用
 *
 * 图标类型:
 * - 文件路径（以 '/' 开头）→ 使用 <image> 组件渲染 SVG 文件
 * - Emoji 字符串 → 走文本渲染（彩色 emoji 保持原样）
 */

/** 通用图标路径前缀 */
const COMMON = '/images/icons/common/'
/** 花卉装饰图标路径前缀 */
const FLOWER = '/images/icons/flower/'

/** 养护动作图标 (Emoji - 彩色保留) */
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

/**
 * 导航 / 操作图标 (SVG 文件路径)
 * 单色线性图标，可通过 CSS tint 着色
 */
const ACTION_ICONS = {
  search: COMMON + 'search.svg',
  add: COMMON + 'plus.svg',
  plus: COMMON + 'plus_filled.svg',
  edit: COMMON + 'edit.svg',
  back: COMMON + 'arrow_left.svg',
  arrow: COMMON + 'arrow_right.svg',
  arrowRight: COMMON + 'arrow_right.svg',
  chevronLeft: COMMON + 'triangle_left.svg',
  chevronRight: COMMON + 'chevron_right.svg',
  close: COMMON + 'no.svg',
  check: COMMON + 'yes.svg',
  more: COMMON + 'more.svg',
  share: COMMON + 'share.svg',
  delete: COMMON + 'delete.svg',
  refresh: COMMON + 'refresh.svg',
}

/** 内容 / 装饰图标 (SVG 文件路径 + Emoji 混合) */
const CONTENT_ICONS = {
  // SVG 文件引用
  plant: COMMON + 'leaf.svg',
  leaf: COMMON + 'leaf.svg',
  clipboard: COMMON + 'clipboard.svg',
  book: COMMON + 'book.svg',
  bell: COMMON + 'bell.svg',
  heart: COMMON + 'heart_filled.svg',
  heartEmpty: COMMON + 'heart.svg',
  gear: COMMON + 'set.svg',
  info: COMMON + 'info.svg',
  mail: COMMON + 'email.svg',
  eye: COMMON + 'eye.svg',

  // 花卉装饰图标 - 精美多彩 SVG
  flower: FLOWER + 'a-023-cherryblossom.svg',
  tree: FLOWER + 'a-030-cactus.svg',
  sunflower: FLOWER + 'a-004-sunflower.svg',
  rose: FLOWER + 'a-018-rose.svg',
  tulip: FLOWER + 'a-020-tulip.svg',
  lily: FLOWER + 'a-022-lily.svg',
  daisy: FLOWER + 'a-021-daisy.svg',
  lotus: FLOWER + 'a-015-lotusflower.svg',
  lavender: FLOWER + 'a-002-lavender.svg',
  orchid: FLOWER + 'a-001-orchid.svg',
  peony: FLOWER + 'a-010-peony.svg',
  dahlia: FLOWER + 'a-003-dahlia.svg',
  poppy: FLOWER + 'a-019-poppy.svg',
  daffodil: FLOWER + 'a-024-daffodil.svg',
}

/** 状态图标 (Emoji - 彩色直观) */
const STATUS_ICONS = {
  success: '✅',
  warning: '⚠️',
  error: '❌',
  loading: '⏳',
  empty: '📭',
}

/** 天气 / 环境图标 (Emoji - 天气彩色) */
const WEATHER_ICONS = {
  sunny: '☀️',
  cloudy: '⛅',
  rainy: '🌧️',
  wind: '💨',
  snow: '❄️',
}

/** 季节图标 (Emoji - 彩色保留) */
const SEASON_ICONS = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
}

/**
 * 完整图标集合 — 供 <icon> 组件使用
 * 通过 ICONS[name] 获取对应图标数据
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
  FLOWER,
}
