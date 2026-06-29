const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

/**
 * 图片内容安全检查（对接微信 imgSecCheck，审核合规必接）
 * 检测用户上传的图片是否包含违规内容（色情、暴力、广告等）
 *
 * @param {String|String[]} mediaUrl - 单张图片 cloud:// URL 或 URL 数组
 * @returns {Object} data.results - 每张图的检测结果数组
 * @returns {String} data.results[].suggest - pass=通过, review=疑似, block=违规
 * @returns {Boolean} data.allPassed - 是否全部通过
 *
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'common',
 *   data: { action: 'imgSecCheck', mediaUrl: 'cloud://xxx/avatars/abc.jpg' }
 * })
 * // { code: 0, data: { allPassed: true, results: [{ suggest: 'pass' }] } }
 */
module.exports = async (event, context) => {
  const { mediaUrl } = event

  // 参数校验
  if (!mediaUrl) return { code: -1, message: '缺少待检测的图片地址' }

  const urls = Array.isArray(mediaUrl) ? mediaUrl : [mediaUrl]
  if (urls.length === 0 || urls.some(u => !u)) {
    return { code: -1, message: '图片地址无效' }
  }

  try {
    const results = await Promise.all(
      urls.map(async (url) => {
        try {
          const res = await cloud.openapi.security.imgSecCheck({
            media_url: url,
          })
          return { url, suggest: res.result.suggest }
        } catch (err) {
          console.error('[imgSecCheck] 单图检测异常:', url, err)
          return { url, suggest: 'block', error: err.message }
        }
      })
    )

    const allPassed = results.every(r => r.suggest === 'pass')
    return { code: 0, data: { allPassed, results } }
  } catch (err) {
    console.error('[imgSecCheck] 安全检查失败:', err)
    return { code: -1, message: '图片安全检查服务异常' }
  }
}
