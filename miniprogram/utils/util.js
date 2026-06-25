/**
 * util.js - 通用工具函数
 */

/**
 * 格式化日期
 * @param {Date|string|number} date
 * @param {string} fmt - 格式模板，默认 'YYYY-MM-DD'
 */
const formatDate = (date, fmt = 'YYYY-MM-DD') => {
  const d = new Date(date)
  const map = {
    YYYY: d.getFullYear(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0'),
    HH: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
  }
  return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, match => map[match])
}

/**
 * 计算天数差
 */
const daysBetween = (date1, date2 = new Date()) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24))
}

/**
 * 安全转 Date：兼容 ISO 字符串、毫秒数、CloudBase serverDate 对象
 */
const toDate = (val) => {
  if (!val) return null
  if (val instanceof Date) return val
  // CloudBase serverDate: { $date: 'iso' } 或 ISO 字符串、时间戳
  if (typeof val === 'object' && val.$date) {
    return new Date(val.$date)
  }
  const d = new Date(val)
  return isNaN(d.getTime()) ? null : d
}

/**
 * 计算"距今多少天/今天/昨天/N 天前"
 */
const formatRelativeDays = (val, fallback = '尚未记录') => {
  const d = toDate(val)
  if (!d) return fallback
  const days = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (days <= 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 30) return `${days}天前`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}个月前`
  return `${Math.floor(months / 12)}年前`
}

/**
 * 计算"X 天后/今天/明天/后天/已逾期"
 */
const formatNextTime = (val) => {
  const next = toDate(val)
  if (!next) return ''
  const now = new Date()
  const hh = String(next.getHours()).padStart(2, '0')
  const mm = String(next.getMinutes()).padStart(2, '0')
  const time = `${hh}:${mm}`
  // 比较自然日
  const nextDay = new Date(next.getFullYear(), next.getMonth(), next.getDate()).getTime()
  const todayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const diffDay = Math.round((nextDay - todayDay) / 86400000)
  if (next.getTime() < now.getTime() && diffDay <= 0) return `已逾期 ${time}`
  if (diffDay === 0) return `今天 ${time}`
  if (diffDay === 1) return `明天 ${time}`
  if (diffDay === 2) return `后天 ${time}`
  if (diffDay > 0) return `${diffDay}天后 ${time}`
  return `已逾期 ${time}`
}

/**
 * 判断是否为今天
 */
const isToday = (val) => {
  const d = toDate(val)
  if (!d) return false
  const now = new Date()
  return d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate()
}

/**
 * 防抖
 */
const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

/**
 * 节流
 */
const throttle = (fn, interval = 300) => {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn.apply(this, args)
    }
  }
}

/**
 * 显示错误提示
 */
const showError = (msg = '操作失败') => {
  wx.showToast({ title: msg, icon: 'none', duration: 2000 })
}

module.exports = {
  formatDate,
  daysBetween,
  toDate,
  formatRelativeDays,
  formatNextTime,
  isToday,
  debounce,
  throttle,
  showError,
}
