/**
 * cloud.js - 云函数调用封装
 * 统一入口，自动处理 loading、错误提示、超时重试
 */

/**
 * 调用云函数
 * @param {string} name - 云函数名称
 * @param {object} data - 传入参数
 * @param {object} options - 可选配置
 * @param {boolean} options.showLoading - 是否显示 loading，默认 false
 * @param {string} options.loadingText - loading 文本
 * @param {number} options.retry - 重试次数，默认 1
 * @returns {Promise<any>}
 */
const callFunction = async (name, data = {}, options = {}) => {
  const { showLoading = false, loadingText = '加载中...', retry = 1 } = options

  if (showLoading) {
    wx.showLoading({ title: loadingText, mask: true })
  }

  let lastErr = null
  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const res = await wx.cloud.callFunction({ name, data })
      const { result } = res

      if (result && result.code !== 0 && result.code !== undefined) {
        console.warn(`[云函数 ${name}] 业务错误:`, result.message)
        throw new Error(result.message || '请求失败')
      }

      return result
    } catch (err) {
      lastErr = err
      const isTimeout = err && (err.message || '').indexOf('timeout') > -1
      if (isTimeout && attempt < retry) {
        // 超时重试
        console.warn(`[云函数 ${name}] 超时，第 ${attempt + 1} 次重试...`)
        continue
      }
      break
    }
  }

  console.error(`[云函数 ${name}] 调用失败:`, lastErr)
  if (showLoading) {
    wx.hideLoading()
  }
  throw lastErr
}

module.exports = {
  callFunction,
}
