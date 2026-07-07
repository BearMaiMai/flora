/**
 * 简易频率限制器（基于 openid + 内存/数据库）
 * 防止单个用户短时间内大量请求
 */
const limits = new Map() // 内存中存储，云函数冷启动后会清空

/**
 * 检查是否超过频率限制
 * @param {String} openid - 用户 openid
 * @param {String} action - 操作名
 * @param {Object} [options] - 配置
 * @param {Number} [options.maxCalls=10] - 最大调用次数
 * @param {Number} [options.windowMs=60000] - 时间窗口（毫秒）
 * @returns {{ allowed: Boolean, remaining: Number }}
 */
module.exports = function checkRateLimit(openid, action, options = {}) {
  const { maxCalls = 10, windowMs = 60000 } = options
  const key = `${openid}:${action}`
  const now = Date.now()

  let record = limits.get(key)
  if (!record || now - record.windowStart > windowMs) {
    record = { windowStart: now, count: 0 }
    limits.set(key, record)
  }

  record.count++
  const remaining = Math.max(0, maxCalls - record.count)
  return {
    allowed: record.count <= maxCalls,
    remaining,
    resetAt: record.windowStart + windowMs
  }
}

/** 清理过期记录（防止内存泄漏，可定期调用） */
module.exports.cleanup = () => {
  const now = Date.now()
  for (const [key, record] of limits) {
    if (now - record.windowStart > 300000) { // 5分钟清理
      limits.delete(key)
    }
  }
}
