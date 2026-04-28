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
  debounce,
  throttle,
  showError,
}
