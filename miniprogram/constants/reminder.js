/**
 * constants/reminder.js - 提醒相关常量
 */

/** 提醒类型 */
const REMINDER_TYPES = {
  WATER: { value: 'water', label: '浇水', icon: '💧' },
  FERTILIZE: { value: 'fertilize', label: '施肥', icon: '🧪' },
  REPOT: { value: 'repot', label: '换盆', icon: '🪴' },
  PRUNE: { value: 'prune', label: '修剪', icon: '✂️' },
  SUNLIGHT: { value: 'sunlight', label: '晒太阳', icon: '☀️' },
}

/** 提醒状态 */
const REMINDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
}

module.exports = {
  REMINDER_TYPES,
  REMINDER_STATUS,
}
