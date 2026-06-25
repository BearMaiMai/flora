/**
 * settings.js - 用户偏好设置
 * 所有用户偏好统一通过此模块读写，便于集中管理与重置
 */
const storage = require('./storage')

/** Storage Key */
const KEY = 'user_settings'

/** 默认偏好 */
const DEFAULT_SETTINGS = {
  // 提醒偏好
  reminderEnabled: true,        // 接收养护提醒（总开关）
  defaultReminderTime: '09:00', // 默认提醒时间
  vibrateEnabled: true,         // 振动反馈

  // 交互偏好
  autoLoadMore: true,           // 列表自动加载更多
  imageLazyLoad: true,          // 图片懒加载

  // 已查看引导
  onboardingSeen: false,
}

/** 读取全部设置 */
const getAll = () => {
  const stored = storage.get(KEY, {}) || {}
  return { ...DEFAULT_SETTINGS, ...stored }
}

/** 读取单项设置 */
const get = (key) => {
  const all = getAll()
  return all[key]
}

/** 写入单项设置 */
const set = (key, value) => {
  const all = getAll()
  all[key] = value
  storage.set(KEY, all)
}

/** 批量写入 */
const update = (partial) => {
  const all = { ...getAll(), ...partial }
  storage.set(KEY, all)
}

/** 重置为默认 */
const reset = () => {
  storage.set(KEY, { ...DEFAULT_SETTINGS })
}

module.exports = {
  KEY,
  DEFAULT_SETTINGS,
  getAll,
  get,
  set,
  update,
  reset,
}
