/**
 * constants/reminder.js - 提醒相关常量
 * type 字段与后端对齐：water / fertilize / repot / prune / sunlight
 */

/** 提醒类型 */
const REMINDER_TYPES = {
  WATER: { value: 'water', label: '浇水', icon: '💧' },
  FERTILIZE: { value: 'fertilize', label: '施肥', icon: '🧪' },
  REPOT: { value: 'repot', label: '换盆', icon: '🪴' },
  PRUNE: { value: 'prune', label: '修剪', icon: '✂️' },
  SUNLIGHT: { value: 'sunlight', label: '晒太阳', icon: '☀️' },
}

/** type → label 映射（用于 UI 显示） */
const REMINDER_TYPE_LABEL = {
  water: '浇水',
  fertilize: '施肥',
  repot: '换盆',
  prune: '修剪',
  sunlight: '晒太阳',
}

/** type → emoji 映射 */
const REMINDER_TYPE_ICON = {
  water: '💧',
  fertilize: '🧪',
  repot: '🪴',
  prune: '✂️',
  sunlight: '☀️',
}

/** type → 样式 class（type-water/type-fertilizer/type-other） */
const REMINDER_TYPE_CLASS = {
  water: 'type-water',
  fertilize: 'type-fertilizer',
  repot: 'type-other',
  prune: 'type-other',
  sunlight: 'type-other',
}

/** 提醒状态 */
const REMINDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
}

module.exports = {
  REMINDER_TYPES,
  REMINDER_TYPE_LABEL,
  REMINDER_TYPE_ICON,
  REMINDER_TYPE_CLASS,
  REMINDER_STATUS,
}
