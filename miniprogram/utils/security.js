// miniprogram/utils/security.js - 内容安全检测工具
// 对接微信小程序内容安全 API（文本 msgSecCheck + 图片 imgSecCheck）

/**
 * 检测文本内容是否违规
 * @param {String} text - 待检测的文本
 * @returns {Promise<{pass: Boolean, suggest: String}>}
 *   pass: true=通过, false=不通过
 *   suggest: pass/review/block
 */
export async function checkText(text) {
  if (!text || !text.trim()) return { pass: true, suggest: 'pass' }

  try {
    const res = await wx.cloud.callFunction({
      name: 'common',
      data: { action: 'checkContent', content: text.trim() }
    })

    const result = res.result
    if (result.code !== 0) {
      console.warn('[security.checkText] 服务异常，默认放行:', result.message)
      return { pass: true, suggest: 'pass' } // 服务异常时放行，避免阻塞正常用户
    }

    const { suggest } = result.data
    return { pass: suggest === 'pass', suggest }
  } catch (err) {
    console.error('[security.checkText] 调用失败:', err)
    return { pass: true, suggest: 'pass' } // 网络异常时放行
  }
}

/**
 * 检测图片是否包含违规内容
 * @param {String|String[]} mediaUrl - 单张或批量图片 cloud:// URL
 * @returns {Promise<{allPassed: Boolean, results: Array}>}
 */
export async function checkImage(mediaUrl) {
  if (!mediaUrl) return { allPassed: true, results: [] }

  try {
    const res = await wx.cloud.callFunction({
      name: 'common',
      data: { action: 'imgSecCheck', mediaUrl }
    })

    const result = res.result
    if (result.code !== 0) {
      console.warn('[security.checkImage] 服务异常，默认放行:', result.message)
      return { allPassed: true, results: [] }
    }

    return result.data // { allPassed, results: [{url, suggest}] }
  } catch (err) {
    console.error('[security.checkImage] 调用失败:', err)
    return { allPassed: true, results: [] }
  }
}

/**
 * 安全检测结果提示（统一用户提示文案）
 * @param {Object} result - checkText 或 checkImage 的返回值
 * @param {Object} [options] - 配置项
 * @param {String} [options.type='text'] - 'text' 或 'image'
 */
export function showSecurityWarning(result, options = {}) {
  const type = options.type || 'text'
  const isImage = type === 'image'

  if ((isImage && !result.allPassed) || (!isImage && !result.pass)) {
    wx.showToast({
      title: `该${isImage ? '图片' : '内容'}含违规信息，请更换`,
      icon: 'none',
      duration: 2500,
    })
    return false
  }
  return true
}

/**
 * 组合检测：先检测文本，再检测图片（异步并行）
 * 用于提交前一次性校验所有内容
 *
 * @param {Object} params
 * @param {String} [params.text] - 待检测文本
 * @param {String|String[]} [params.images] - 待检测图片 URL
 * @returns {Promise<{textPass: Boolean, imagePass: Boolean}>}
 */
export async function checkAll({ text, images }) {
  const tasks = []

  if (text && text.trim()) {
    tasks.push(checkText(text).then(r => ({ type: 'text', ...r })))
  }
  if (images && (Array.isArray(images) ? images.length : images)) {
    tasks.push(checkImage(images).then(r => ({ type: 'image', ...r })))
  }

  if (tasks.length === 0) return { textPass: true, imagePass: true }

  const results = await Promise.all(tasks)

  let textPass = true
  let imagePass = true

  for (const r of results) {
    if (r.type === 'text') textPass = r.pass
    else if (r.type === 'image') imagePass = r.allPassed
  }

  return { textPass, imagePass, results }
}
