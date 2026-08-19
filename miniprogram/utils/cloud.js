/**
 * cloud.js - 云函数调用封装
 * 统一入口，自动处理 loading、错误提示、超时重试
 */

/**
 * 业务错误，包含后端返回的 code/message
 */
class BizError extends Error {
  constructor(code, message) {
    super(message || '请求失败')
    this.name = 'BizError'
    this.code = code
  }
}

/**
 * 调用云函数
 * @param {string} name - 云函数名称
 * @param {object} data - 传入参数
 * @param {object} options - 可选配置
 * @param {boolean} options.showLoading - 是否显示 loading，默认 false
 * @param {string} options.loadingText - loading 文本
 * @param {number} options.retry - 重试次数，默认 1
 * @returns {Promise<any>} 云函数返回的 result 对象（含 code/data/message）
 */
const callFunction = async (name, data = {}, options = {}) => {
  const { showLoading = false, loadingText = '加载中...', retry = 1 } = options

  if (showLoading) {
    wx.showLoading({ title: loadingText, mask: true })
  }

  let lastErr = null
  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const res = await wx.cloud.callFunction({
        name,
        data,
        config: { timeout: 10000 }
      })
      const { result } = res

      // 业务错误：code 非 0
      if (result && typeof result.code !== 'undefined' && result.code !== 0) {
        const bizErr = new BizError(result.code, result.message || '请求失败')
        console.warn(`[云函数 ${name}] 业务错误 code=${result.code}:`, bizErr.message)
        if (showLoading) wx.hideLoading()
        throw bizErr
      }

      // 没有返回值或异常情况
      if (!result) {
        throw new Error('云函数返回空响应')
      }

      if (showLoading) wx.hideLoading()
      return result
    } catch (err) {
      lastErr = err
      // 业务错误不重试，直接抛出
      if (err instanceof BizError) throw err

      const msg = (err && err.message) || ''
      const isTimeout = msg.indexOf('timeout') > -1
      if (isTimeout && attempt < retry) {
        console.warn(`[云函数 ${name}] 超时，第 ${attempt + 1} 次重试...`)
        continue
      }
      break
    }
  }

  console.error(`[云函数 ${name}] 调用失败:`, lastErr)
  if (showLoading) wx.hideLoading()
  throw lastErr
}

module.exports = {
  callFunction,
  BizError,
}
